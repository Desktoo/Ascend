import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { Prisma } from '@day-mark/db';
import { PrismaService } from '../../common/prisma/prisma.service';
import { env } from '@day-mark/config';
import { GamificationCacheRepository } from 'src/common/gamification/repos/gamification-cache.repo';
import { getUserLogicalDate } from 'src/common/utils/time.utils';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationCache: GamificationCacheRepository,
    private readonly dynamoDbService: DynamoDbService,
  ) {}

  async createUserProfile(
    tx: Prisma.TransactionClient,
    email: string,
    userName: string,
    timeZone: string,
    avatarUrl?: string | null,
  ) {
    const existingUser = await tx.user.findFirst({
      where: { OR: [{ email }, { userName }] },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return tx.user.create({
      data: {
        email,
        userName,
        timeZone: timeZone,
        avatar_url: avatarUrl || null,
        notificationPreference: {
          create: {
            webPushEnabled: true,
            masterNotification: true,
            midDayReminder: true,
          },
        },
      },
      include: {
        notificationPreference: true,
      },
    });
  }

  async linkAccount(
    tx: Prisma.TransactionClient,
    userId: string,
    type: string,
    provider: Prisma.AccountCreateInput['provider'],
    providerAccountId: string,
    password: string | null,
  ) {
    return tx.account.create({
      data: {
        userId,
        type,
        provider,
        providerAccountId,
        password,
      },
    });
  }

  async findByIdentifier(identifier: string) {
    return this.prisma.client.user.findFirst({
      where: {
        OR: [{ email: identifier }, { userName: identifier }],
      },
      include: {
        accounts: true,
      },
    });
  }

  async findAccountByProvider(
    provider: Prisma.AccountCreateInput['provider'],
    providerAccountId: string,
  ) {
    return this.prisma.client.account.findFirst({
      where: {
        provider,
        providerAccountId,
      },
      include: {
        user: true,
      },
    });
  }

  async getUserProfile(userId: string) {
    const cachedProfile = await this.gamificationCache.getFullHash(userId);

    if (
      cachedProfile &&
      cachedProfile.xp &&
      cachedProfile.level &&
      cachedProfile.rank
    ) {
      const userDbBase = await this.prisma.client.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          accounts: {
            select: {
              provider: true,
              password: true,
            },
          },
        },
      });

      if (!userDbBase) return;

      const hasPassword = userDbBase.accounts.some(
        (acc) => acc.provider === 'CREDENTIALS' && Boolean(acc.password),
      );

      const logicalDate = getUserLogicalDate(
        userDbBase.timeZone,
        userDbBase.dayStartTime,
      );
      const pk = `USER#${userId}`;
      const skPrefix = `REFLECTION#${logicalDate}`;

      const existingReflection = await this.dynamoDbService.queryByPrefix(
        pk,
        skPrefix,
      );

      return {
        ...userDbBase,
        logicalDate,
        hasPassword,
        hasSubmittedReflectionToday: existingReflection.length > 0,
        level: Number(cachedProfile.level),
        xp: Number(cachedProfile.xp),
        rank: cachedProfile.rank,
      };
    }

    const userDb = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userDb) return null;

    await this.gamificationCache.setHashFields(userId, {
      level: userDb.level,
      xp: userDb.xp,
      rank: userDb.rank,
    });
  }

  async updateUserTimeZone(userId: string, timeZone: string): Promise<void> {
    try {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: { timeZone: timeZone },
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Failed to update timezone. User not Found.');
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    // 1. Verify user entity existence before execution mutations
    const userExists = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }, // Optimized selection lookup to save memory
    });

    if (!userExists) {
      throw new NotFoundException(
        'Security update rejected. User matching these coordinates does not exist.',
      );
    }

    try {
      // 2. Compute a secure cryptographic salt value and hash the incoming password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        newPassword + env.BCRYPT_SECRET_PEPPER,
        saltRounds,
      );

      const existingCredentialsAccount =
        await this.prisma.client.account.findFirst({
          where: {
            userId: userId,
            provider: 'CREDENTIALS',
          },
        });

      if (existingCredentialsAccount) {
        // Update their existing local password record
        await this.prisma.client.account.update({
          where: { id: existingCredentialsAccount.id },
          data: { password: hashedPassword },
        });
      } else {
        // If they originally signed up via Google/GitHub, create a native credentials link now
        await this.prisma.client.account.create({
          data: {
            userId: userId,
            type: 'credentials',
            provider: 'CREDENTIALS',
            providerAccountId: userId, // Using email as the unique identifier for local logins
            password: hashedPassword,
          },
        });
      }

      console.log(
        `[Security Matrix] Password record synchronized for User ID: ${userId}`,
      );
    } catch (error) {
      console.error(
        '[UserService Error] Failed to update password matrix:',
        error,
      );
      throw new InternalServerErrorException(
        'A structural error occurred while committing your new credentials to the database.',
      );
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      return await this.prisma.client.user.update({
        where: { id: userId },
        data: dto, // Prisma automatically ignores undefined keys in DTO
        select: {
          id: true,
          userName: true,
          email: true,
          dayStartTime: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error(
        '[UserService Error] Failed to update user profile:',
        error,
      );
      throw new InternalServerErrorException('Failed to update user profile.');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    // 1. Verify user exists and fetch linked provider accounts
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        accounts: {
          select: {
            id: true,
            provider: true,
            password: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User matching these credentials does not exist.',
      );
    }

    // 2. Locate native CREDENTIALS account
    const credentialsAccount = user.accounts.find(
      (acc) => acc.provider === 'CREDENTIALS',
    );

    // 3. Reject if user registered purely via Google/GitHub without a local password
    if (!credentialsAccount || !credentialsAccount.password) {
      throw new BadRequestException(
        'Your account is managed via an external provider (Google/GitHub). Password updates are disabled.',
      );
    }

    // 4. Verify current password hash match
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword + (env.BCRYPT_SECRET_PEPPER || ''),
      credentialsAccount.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    try {
      // 5. Hash new password & commit to Account model
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(
        dto.newPassword + (env.BCRYPT_SECRET_PEPPER || ''),
        saltRounds,
      );

      await this.prisma.client.account.update({
        where: { id: credentialsAccount.id },
        data: { password: hashedNewPassword },
      });

      console.log(`[Security Matrix] Password updated for User ID: ${userId}`);
    } catch (error) {
      console.error(
        '[UserService Error] Failed to commit new password hash:',
        error,
      );
      throw new InternalServerErrorException(
        'A structural error occurred while updating your password.',
      );
    }
  }
}
