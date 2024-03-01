import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from 'bme/core';
import { AuthModule } from './auth/auth.module';
import { AssignorModule } from './assignor/assignor.module';
import { PayableModule } from './payable/payable.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CoreModule, AuthModule, AssignorModule, PayableModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
