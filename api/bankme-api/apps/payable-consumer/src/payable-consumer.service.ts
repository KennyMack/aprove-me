import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMQService } from 'bme/core/infra/rabbitmq/rabbit-mq.service';

@Injectable()
export class PayableConsumerService {
  constructor(readonly rabbit: RabbitMQService) {}
  getHello(): string {
    return 'Hello World!';
  }

  @OnEvent('blb')
  create(event: any) {
    console.log('blb');
  }
}
