import { BaseEntity } from 'bme/core/infra/entities/base-entity';

export class User extends BaseEntity {
  public login: string;
  public password: string;
}
