import { IErrorDomainService } from 'bme/core/infra/errors/error-domain-service.interface';
import { UserVO } from '../vos/user.vo';
import { User } from '../entities/users.entity';

export interface IUserDomainService extends IErrorDomainService {
  validate(data: UserVO): Promise<boolean>;
  create(data: UserVO): Promise<User>;
  changeById(id: string, data: UserVO): Promise<User>;
  removeById(id: string): Promise<UserVO>;
  getAll(): Promise<UserVO[]>;
  getById(id: string): Promise<UserVO>;
}
