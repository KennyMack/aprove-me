import { BaseVO } from 'bme/core/infra/entities/base-vo';

export class AssignorVO extends BaseVO {
  constructor(
    public readonly document: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly name: string,
  ) {
    super('');
  }
}