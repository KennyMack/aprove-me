export class RedeliveryMessages {
  public messages: string[] = [];

  public push(id: string) {
    this.messages.push(id);
  }

  public pop(id: string) {
    this.messages = this.messages.filter((x) => x !== id);
  }

  public count(id: string): number {
    return this.messages.filter((x) => x === id).length;
  }

  public clearAll() {
    this.messages = [];
  }
}
