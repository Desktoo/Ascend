import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma, type PrismaClientType } from '@day-mark/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  [x: string]: any;
  public readonly client: PrismaClientType = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
