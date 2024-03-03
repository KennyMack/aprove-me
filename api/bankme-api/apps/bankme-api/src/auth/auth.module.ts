import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CoreModule } from 'bme/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CoreModule,
    JwtModule.register({
      global: true,
      secret: process.env.MORDOR_PHRASE,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
