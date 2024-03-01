import { BaseVO } from 'bme/core/infra/entities/base-vo';

export class UserVO extends BaseVO {
  constructor(
    public readonly id: string,
    public readonly login: string,
    public readonly password: string,
    public readonly createdAt: Date = new Date(),
    public readonly updateAt: Date = new Date(),
  ) {
    super(id);
  }
}
