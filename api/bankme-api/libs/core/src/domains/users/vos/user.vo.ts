import { BaseVO } from 'bme/core/infra/entities/base-vo';
import { Fails } from 'bme/core/messages/fails';

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

  public override isValid(): string {
    if (!this.login) return Fails.INVALID_LOGIN;
    if (!this.password) return Fails.INVALID_PASSWORD;

    return null;
  }
}
