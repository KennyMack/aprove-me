import { Message } from 'amqplib';
export interface IConsumeQueue {
  connect(): Promise<void>;
  handleNewMessage(message: Message): boolean;
  ackMessage(message: Message): void;
  nackMessage(message: Message): void;
}
