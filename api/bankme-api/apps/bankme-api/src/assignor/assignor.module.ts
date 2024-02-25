import { Module } from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { AssignorController } from './assignor.controller';
import { CoreModule } from 'bme/core';

@Module({
  imports: [CoreModule],
  controllers: [AssignorController],
  providers: [AssignorService],
})
export class AssignorModule {}
