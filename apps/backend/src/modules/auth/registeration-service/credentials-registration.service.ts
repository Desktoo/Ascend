import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import bcrypt from 'bcrypt';
import { Prisma } from '@day-mark/db';
import { env } from '@day-mark/config';

@Injectable()
export class CredentialRegistrationService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async register(
    email: string,
    userName: string,
    passwordPlainText: string,
    timeZone: string,
  ) {
    const passwordHash = await bcrypt.hash(
      passwordPlainText + env.BCRYPT_SECRET_PEPPER,
      10,
    );

    return this.prismaService.client.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await this.userService.createUserProfile(
          tx,
          email,
          userName,
          timeZone,
        );
        await this.userService.linkAccount(
          tx,
          user.id,
          'credentials',
          'CREDENTIALS',
          // TODO: this is providerAccount id need to work on it
          user.id,
          passwordHash,
        );
        return user;
      },
    );
  }
}
