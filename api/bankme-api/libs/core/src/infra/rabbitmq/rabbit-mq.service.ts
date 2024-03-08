import { Injectable, OnApplicationShutdown, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { connect, ConnectionUrl } from 'amqp-connection-manager';
import {
  IAmqpConnectionManager,
  ChannelWrapper,
  Message,
  ConfirmChannel,
} from 'amqplib';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class RabbitMQService implements OnApplicationShutdown {
  private connUrlString: ConnectionUrl;
  private channel: ChannelWrapper;
  private connection: IAmqpConnectionManager;
  private _exchange: string;
  private _queue: string;
  public newMessage: Function;

  constructor(private eventEmitter: EventEmitter2) {
    this.connUrlString = `amqps://${process.env.USER_RABBIT}:${process.env.PASS_RABBIT}@${process.env.HOST_RABBIT}/${process.env.VHOST_RABBIT}`;
  }

  public getConnectioUrl() {
    return this.connUrlString;
  }

  public async startConsuming(
    exchange: string,
    queue: string,
    isJson: boolean,
  ) {
    this._exchange = exchange;
    this._queue = queue;

    this.connection = connect([this.getConnectioUrl()]);

    this.channel = await this.connection.createChannel({
      //name: this._exchange,
      json: isJson,
      setup: async (ch: ConfirmChannel) => {
        await ch.assertQueue(this._queue, {
          durable: true,
        });
        ch.consume(this._queue, this.handleNewMessage.bind(this), {
          noAck: false,
        });
      },
    });

    /*
    this.channel.addSetup(async (ch: ConfirmChannel) => {
      await ch.consume(queue, this.handleNewMessage.bind(this), {
        noAck: false,
      });
    });
    */
  }

  private handleNewMessage(message: Message) {
    console.log('handleNewMessage');
    if (message == null || this.newMessage == null) {
      this.noAckMessage(message);
      return;
    }

    console.log('handleNewMessage 1');
    this.newMessage(message);
    /*
    this.eventEmitter.emit(
      `rabbit.new.${this._exchange}.${this._queue}`,
      message,
    );
    */
  }

  public ackMessage(message: Message) {
    if (message == null) return;
    this.channel?.ack(message);
  }

  public noAckMessage(message: Message) {
    if (message == null) return;
    this.channel?.nack(message);
  }

  async onApplicationShutdown(signal?: string) {
    console.log(signal);
    if (this.connection && this.connection.isConnected()) {
      this.connection.close();
    }
    //await this.$disconnect();
  }
}
