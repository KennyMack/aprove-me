import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbit-mq.service';
import { EXCHANGE_APROVAME, QUEUE_PAYABLE } from './constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PayableQueue {
  contagem: number = 1;
  constructor(
    readonly eventEmitter: EventEmitter2,
    readonly rabbit: RabbitMQService,
  ) {}

  public async connect() {
    console.log('connect');
    await this.rabbit.startConsuming(EXCHANGE_APROVAME, QUEUE_PAYABLE, true);

    //this.rabbit.newMessage = this.handleNewMessage;
  }

  // @OnEvent(`rabbit.new.${EXCHANGE_APROVAME}.${QUEUE_PAYABLE}`, { async: true })
  handleNewMessage(event: any) {
    console.log('rabbit');
    console.log(this.contagem++);
    console.log(event.content.toString());
    this.rabbit.ackMessage(event);
    this.eventEmitter.emit(`blb`, event);
  }
}
