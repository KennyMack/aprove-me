import { Module } from '@nestjs/common';
import { PayableConsumerController } from './payable-consumer.controller';
import { PayableConsumerService } from './payable-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from 'bme/core';
import { PayableQueue } from 'bme/core/infra/rabbitmq/queues/payable.queue';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [CoreModule, ConfigModule.forRoot(), EventEmitterModule.forRoot()],
  controllers: [PayableConsumerController],
  providers: [PayableConsumerService, PayableQueue],
})
export class PayableConsumerModule {
  constructor(private readonly rabbit: PayableQueue) {}

  async onModuleInit() {
    console.log('init');
    await this.rabbit.connect();
  }
}
