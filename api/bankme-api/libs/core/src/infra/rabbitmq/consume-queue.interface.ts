export interface IQueue {
  connect(): Promise<void>;
  handleNewMessage(message: any): boolean;
}
