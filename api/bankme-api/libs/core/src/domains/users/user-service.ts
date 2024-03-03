import { Inject, Injectable } from '@nestjs/common';
import { ErrorDomainService } from 'bme/core/infra/errors/error-domain.service';
import { IUserDomainService } from './interfaces/user-service.interface';
import { UserRepository } from 'bme/core/infra/database/repositories/user-repository';
import { IUserRepository } from './interfaces/user-repository.interface';
import { User } from './entities/users.entity';
import { UserVO } from './vos/user.vo';
import { Fails } from 'bme/core/messages/fails';
import { Sequence } from 'bme/core/sequence';
import { AuthVO } from './vos/auth.vo';
import { MordorCripto } from 'bme/core/mordor-cripto';

@Injectable()
export class UserDomainService
  extends ErrorDomainService
  implements IUserDomainService
{
  constructor(
    @Inject(UserRepository)
    private userRepo: IUserRepository,
  ) {
    super();
  }

  async auth(login: string, password: string): Promise<AuthVO> {
    const user = await this.userRepo.getByLogin(login);
    let passwordValid = false;

    if (user) {
      passwordValid = MordorCripto.Compare(password, user.password);
    }

    if (!passwordValid) {
      this.addError(Fails.INVALID_LOGIN_OR_PASSWORD);
    }

    return new AuthVO('', passwordValid);
  }

  async validate(data: UserVO): Promise<boolean> {
    const validationError = data.isValid();

    if (validationError) {
      super.addError(validationError);
      return false;
    }

    const loginExists = await this.userRepo.existsLogin(data.id, data.login);

    if (loginExists) {
      super.addError(Fails.LOGIN_ALREADY_EXISTS);
      return false;
    }

    return true;
  }

  async create(data: UserVO): Promise<User> {
    const isValid = await this.validate(data);
    if (!isValid) return null;

    const assignorData = new User();
    assignorData.id = data.id || Sequence.getNext();
    assignorData.login = data.login;
    assignorData.password = MordorCripto.Encrypt(data.password);

    return await this.userRepo.create(assignorData);
  }

  async changeById(id: string, data: UserVO): Promise<User> {
    const isValid = await this.validate(data);
    if (!isValid) return null;

    const userDb = await this.userRepo.getById(id);

    if (userDb == null) super.addError(Fails.INVALID_USER_ID);

    if (super.getErrors().length) return null;

    const userData = new User();
    userData.id = id;
    userData.login = data.login;
    userData.password = MordorCripto.Encrypt(data.password);
    userData.createdAt = userDb.createdAt;
    userData.updateAt = new Date();

    return await this.userRepo.changeById(id, userData);
  }

  async getAll(): Promise<UserVO[]> {
    const result = await this.userRepo.getAll();

    return result.map(
      (x) => new UserVO(x.id, x.login, '', x.createdAt, x.updateAt),
    );
  }

  async getById(id: string): Promise<UserVO> {
    const result = await this.userRepo.getById(id);

    if (result == null) return null;

    return new UserVO(
      result.id,
      result.login,
      '',
      result.createdAt,
      result.updateAt,
    );
  }

  async removeById(id: string): Promise<UserVO> {
    const removed = await this.userRepo.removeById(id);
    if (!removed) return null;

    return new UserVO(
      removed.id,
      removed.login,
      '',
      removed.createdAt,
      removed.updateAt,
    );
  }
}
