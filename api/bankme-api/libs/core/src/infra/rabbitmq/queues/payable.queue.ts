import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbit-mq.service';
import {
  EXCHANGE_DEAD_PAYABLES,
  EXCHANGE_PAYABLES,
  QUEUE_DEAD_PAYABLES,
  QUEUE_PAYABLES,
  ROUTING_DEAD_PAYABLE,
  ROUTING_NEW_PAYABLE,
} from './options';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedeliveryMessages } from '../redelivery';
import { IConsumeQueue } from '../consume-queue.interface';
import { IPublishQueue } from '../publish-queue.interface';

@Injectable()
export class PayableQueue
  extends RabbitMQService
  implements IConsumeQueue, IPublishQueue
{
  constructor(
    protected readonly eventEmitter: EventEmitter2,
    protected readonly redeliveries: RedeliveryMessages,
  ) {
    super(eventEmitter, redeliveries);
  }

  async publish(messageId: string, data: any, header: object): Promise<void> {
    await super.publishMessage(
      EXCHANGE_PAYABLES,
      ROUTING_NEW_PAYABLE,
      messageId,
      data,
      header,
      {
        isJson: true,
        durable: true,
      },
    );
  }

  public async connect(): Promise<void> {
    await super.startConsuming(
      EXCHANGE_PAYABLES,
      QUEUE_PAYABLES,
      ROUTING_NEW_PAYABLE,
      {
        isJson: true,
        durable: true,
        deadLetterExchange: EXCHANGE_DEAD_PAYABLES,
        deadLetterRoutingKey: ROUTING_DEAD_PAYABLE,
        deadLetterQueue: QUEUE_DEAD_PAYABLES,
      },
    );
  }

  public override handleNewMessage(message: any): boolean {
    if (!super.handleNewMessage(message)) return false;

    const deliverCount = super.getCurrentDeliveryCount(message);

    this.eventEmitter.emit(`blb`, message);
    super.nackMessage(message, deliverCount <= 4);

    return true;
  }
}
