import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IQueue } from 'bme/core/infra/rabbitmq/queue.interface';
import { PayableQueue } from 'bme/core/infra/rabbitmq/queues/payable.queue';

@Injectable()
export class PayableConsumerService {
  constructor(
    @Inject(PayableQueue)
    readonly rabbit: IQueue,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  @OnEvent('blb')
  create(event: any) {
    console.log('blb');
  }
}
