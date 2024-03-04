import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CoreModule } from 'bme/core';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
