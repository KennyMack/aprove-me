import { IErrorDomainService } from 'bme/core/infra/errors/error-domain-service.interface';
import { UserVO } from '../vos/user.vo';
import { AuthVO } from '../vos/auth.vo';

export interface IUserDomainService extends IErrorDomainService {
  validate(data: UserVO): Promise<boolean>;
  create(data: UserVO): Promise<UserVO>;
  changeById(id: string, data: UserVO): Promise<UserVO>;
  removeById(id: string): Promise<UserVO>;
  getAll(): Promise<UserVO[]>;
  getById(id: string): Promise<UserVO>;
  auth(login: string, password: string): Promise<AuthVO>;
}
