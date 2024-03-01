import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  async onApplicationShutdown(signal?: string) {
    console.log(signal);
    await this.$disconnect();
  }

  async onModuleInit() {
    this.$connect();
  }
}
