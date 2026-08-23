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
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import {
  CachedCoreProfile,
  UserCacheRepository,
} from './repos/user-cache.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationCache: GamificationCacheRepository,
    private readonly dynamoDbService: DynamoDbService,
    private readonly userCache: UserCacheRepository,
    private readonly redis: RedisCacheService,
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

    const user = await tx.user.create({
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

    const coreProfile = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      timeZone: user.timeZone,
      dayStartTime: user.dayStartTime,
      avatarUrl: user.avatar_url,
      isOnboarded: Boolean(user.isOnboarded),
      hasPassword: false, // Always false at the exact moment of user creation
    };

    // Use the repository to handle string casting and TTL automatically
    await this.userCache.setCoreProfile(user.id, coreProfile);

    return user;
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
    // 1. Fetch both caches concurrently
    const [cachedProfile, cachedGamification] = await Promise.all([
      this.userCache.getCoreProfile(userId),
      this.gamificationCache.getFullHash(userId),
    ]);

    // Determine exactly what is missing
    const needsCoreProfile = !cachedProfile;
    const needsGamification = !cachedGamification || !cachedGamification.xp;

    // 2. THE SENIOR MOVE: If either cache is missing, fetch the DB ONCE.
    // By using a ternary operator with `const`, TypeScript perfectly infers
    // the massive Prisma return type automatically.
    const userDb =
      needsCoreProfile || needsGamification
        ? await this.prisma.client.user.findUnique({
            where: { id: userId },
            include: {
              accounts: { select: { provider: true, password: true } },
            },
          })
        : null;

    // Early exit if the user was deleted but cache somehow triggered this
    if ((needsCoreProfile || needsGamification) && !userDb) return null;

    // 3. Resolve Core Profile
    let coreProfile: CachedCoreProfile;

    if (cachedProfile) {
      coreProfile = cachedProfile;
    } else {
      // We use the "!" non-null assertion because our check above guarantees userDb exists here
      const hasPassword = userDb!.accounts.some(
        (acc) => acc.provider === 'CREDENTIALS' && Boolean(acc.password),
      );

      coreProfile = {
        id: userDb!.id,
        email: userDb!.email,
        userName: userDb!.userName,
        timeZone: userDb!.timeZone,
        dayStartTime: userDb!.dayStartTime,
        avatarUrl: userDb!.avatar_url,
        isOnboarded: Boolean(userDb!.isOnboarded),
        hasPassword,
      };
      await this.userCache.setCoreProfile(userId, coreProfile);
    }

    // 4. Resolve Gamification Cache
    let gamification = cachedGamification;

    if (needsGamification) {
      gamification = {
        level: String(userDb!.level),
        xp: String(userDb!.xp),
        rank: userDb!.rank,
      };
      await this.gamificationCache.setHashFields(userId, {
        level: gamification.level,
        xp: gamification.xp,
        rank: gamification.rank,
      });
    }

    // 5. Check DynamoDB for today's reflection
    const logicalDate = getUserLogicalDate(
      coreProfile.timeZone,
      coreProfile.dayStartTime,
    );

    const existingReflection = await this.dynamoDbService.queryByPrefix(
      `USER#${userId}`,
      `REFLECTION#${logicalDate}`,
    );

    // 6. Merge and Return
    return {
      ...coreProfile,
      logicalDate,
      hasSubmittedReflectionToday: existingReflection.length > 0,
      level: Number(gamification!.level),
      xp: Number(gamification!.xp),
      rank: gamification!.rank,
    };
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

  async completeOnboarding(userId: string, dto: CompleteOnboardingDto) {
    // 1. Check if username is already taken
    const existingUser = await this.prisma.client.user.findUnique({
      where: { userName: dto.userName },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Username is already taken');
    }

    // 2. Update the PostgreSQL Database
    const updatedUser = await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        userName: dto.userName,
        dayStartTime: dto.dayStartTime,
        isOnboarded: true,
      },
    });

    // 3. THE FIX: Update the Redis Cache (Write-Through)
    const existingCache = await this.userCache.getCoreProfile(userId);
    if (existingCache) {
      // Merge the new onboarding data into the existing cached profile
      await this.userCache.setCoreProfile(userId, {
        ...existingCache,
        userName: updatedUser.userName,
        dayStartTime: updatedUser.dayStartTime,
        isOnboarded: true,
      });
    } else {
      // Failsafe: If the cache was missing for any reason, invalidate the key
      // so the next request forces a fresh DB read instead of serving stale data.
      await this.userCache.invalidateProfile(userId);
    }

    return updatedUser;
  }
}
