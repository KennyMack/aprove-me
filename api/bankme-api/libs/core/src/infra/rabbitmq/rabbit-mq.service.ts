import { OnApplicationShutdown } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { connect, ConnectionUrl } from 'amqp-connection-manager';
import {
  IAmqpConnectionManager,
  ChannelWrapper,
  Message,
  ConfirmChannel,
} from 'amqplib';
import { RedeliveryMessages } from './redelivery';

export type optionsQueue = {
  isJson?: boolean;
  durable?: boolean;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  deadLetterQueue?: string;
};

const KEY_DEAD_LETTER_EXCHANGE: string = 'x-dead-letter-exchange';
const KEY_DEAD_LETTER_ROUTING_KEY: string = 'x-dead-letter-routing-key';

export abstract class RabbitMQService implements OnApplicationShutdown {
  private connUrlString: ConnectionUrl;
  private channel: ChannelWrapper;
  private connection: IAmqpConnectionManager;
  private _exchange: string;
  private _queue: string;

  constructor(
    protected eventEmitter: EventEmitter2,
    protected redeliveries: RedeliveryMessages,
  ) {
    this.connUrlString = process.env.RABBIT_URL || '';
    // `amqps://${process.env.USER_RABBIT}:${process.env.PASS_RABBIT}@${process.env.HOST_RABBIT}/${process.env.VHOST_RABBIT}`;
  }

  protected getConnectioUrl() {
    console.log(this.connUrlString);
    return this.connUrlString;
  }

  protected setValueIfDefined(obj: object, prop: string, value: any) {
    if (value != undefined) obj[prop] = value;
  }

  private async createExchange(
    ch: ConfirmChannel,
    name: string,
    type: string,
    autoDelete: boolean,
    durable: boolean,
  ) {
    await ch.assertExchange(name, type, {
      autoDelete,
      durable,
    });
  }

  private async createQueue(
    ch: ConfirmChannel,
    name: string,
    autoDelete: boolean,
    durable: boolean,
    args: object,
  ) {
    await ch.assertQueue(name, {
      autoDelete: autoDelete,
      durable: durable,
      arguments: args,
    });
  }

  private async bindQueue(
    ch: ConfirmChannel,
    queueName: string,
    exchangeName: string,
    routingKey: string,
  ) {
    await ch.bindQueue(queueName, exchangeName, routingKey, {});
  }

  protected async startConsuming(
    exchange: string,
    queue: string,
    routingKey: string,
    options: optionsQueue,
  ) {
    this._exchange = exchange;
    this._queue = queue;

    this.connection = connect([this.getConnectioUrl()]);

    const queueArgs = {};

    this.setValueIfDefined(
      queueArgs,
      KEY_DEAD_LETTER_EXCHANGE,
      options.deadLetterExchange,
    );
    this.setValueIfDefined(
      queueArgs,
      KEY_DEAD_LETTER_ROUTING_KEY,
      options.deadLetterRoutingKey,
    );

    this.channel = await this.connection.createChannel({
      json: options.isJson || true,
      setup: async (ch: ConfirmChannel) => {
        await this.createExchange(
          ch,
          this._exchange,
          'topic',
          false,
          options.durable || false,
        );

        await this.createQueue(
          ch,
          this._queue,
          false,
          options.durable || false,
          queueArgs,
        );

        await this.bindQueue(ch, this._queue, this._exchange, routingKey);

        if (
          (options.deadLetterExchange || '') &&
          (options.deadLetterQueue || '')
        ) {
          await this.createExchange(
            ch,
            this._exchange,
            'topic',
            false,
            options.durable || false,
          );

          await this.createQueue(
            ch,
            options.deadLetterQueue,
            false,
            options.durable || false,
            {},
          );

          this.bindQueue(
            ch,
            options.deadLetterQueue,
            this._exchange,
            options.deadLetterRoutingKey,
          );
        }

        ch.consume(this._queue, this.handleNewMessage.bind(this), {
          noAck: false,
        });
      },
    });
  }

  protected getCurrentDeliveryCount(message: Message): number {
    return this.redeliveries.count(this.getMessageId(message));
  }

  protected getMessageId(message: Message): string {
    return message.properties.messageId;
  }

  public handleNewMessage(message: Message): boolean {
    if (message == null) {
      this.nackMessage(message);
      return false;
    }

    if (this.getMessageId(message))
      this.redeliveries.push(this.getMessageId(message));

    return !(message == null);
  }

  protected ackMessage(message: Message) {
    if (message == null) return;
    this.channel?.ack(message);
    this.redeliveries.pop(this.getMessageId(message));
  }

  protected nackMessage(message: Message, redelivery: boolean = true) {
    if (message == null) return;
    this.channel?.nack(message, false, redelivery);
    if (!redelivery) this.redeliveries.pop(this.getMessageId(message));
  }

  async onApplicationShutdown(signal?: string) {
    console.log(signal);
    this.redeliveries.clearAll();
    if (this.connection && this.connection.isConnected()) {
      this.connection.close();
    }
  }
}
