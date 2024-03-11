import { optionsQueue } from './rabbit-mq.service';

export interface IPublishQueue {
  connect(): Promise<void>;
  publish(messageId: string, data: any, header: object): Promise<void>;
}
