import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { Prisma } from '@day-mark/db';

@Injectable()
export class OAuthRegistrationService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}
  async register(
    email: string,
    displayName: string,
    provider: Prisma.AccountCreateInput['provider'],
    providerAccountId: string,
    timeZone: string,
    avatarUrl?: string,
  ) {
    const generateUserName = `${displayName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;

    return this.prismaService.client.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await this.userService.createUserProfile(
          tx,
          email,
          generateUserName,
          timeZone,
          avatarUrl,
        );
        await this.userService.linkAccount(
          tx,
          user.id,
          'oauth',
          provider,
          providerAccountId,
          null,
        );
        return user;
      },
    );
  }
}
