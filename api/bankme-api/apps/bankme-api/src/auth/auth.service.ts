import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserDomainService } from 'bme/core/domains/users/user-service';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { HttpResult } from 'bme/core/http/http-result';
import { UserVO } from 'bme/core/domains/users/vos/user.vo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserDomainService)
    protected userService: IUserDomainService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const userVO = new UserVO('', createAuthDto.login, createAuthDto.password);

    try {
      this.userService.resetDomain();

      const createResult = await this.userService.create(userVO);
      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest(
          createAuthDto,
          this.userService.getErrors(),
        );

      return HttpResult.Created(createResult);
    } catch (e) {
      return HttpResult.UnprocessableEntity(createAuthDto, [
        e.message,
        ...this.userService.getErrors(),
      ]);
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const userVO = new UserVO(id, updateAuthDto.login, updateAuthDto.password);

    try {
      this.userService.resetDomain();

      const createResult = await this.userService.changeById(id, userVO);
      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest(
          updateAuthDto,
          this.userService.getErrors(),
        );

      return HttpResult.Ok(createResult);
    } catch (e) {
      return HttpResult.UnprocessableEntity(updateAuthDto, [
        e.message,
        ...this.userService.getErrors(),
      ]);
    }
  }

  async findAll() {
    try {
      this.userService.resetDomain();
      const results = await this.userService.getAll();
      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({}, this.userService.getErrors());

      return HttpResult.Ok({
        results,
      });
    } catch (e) {
      return HttpResult.BadRequest({}, [
        e.message,
        ...this.userService.getErrors(),
      ]);
    }
  }

  async findOne(id: string) {
    try {
      this.userService.resetDomain();
      const result = await this.userService.getById(id);
      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({ id }, this.userService.getErrors());

      return HttpResult.Ok(result);
    } catch (e) {
      return HttpResult.BadRequest({ id }, [
        e.message,
        ...this.userService.getErrors(),
      ]);
    }
  }

  async remove(id: string) {
    try {
      this.userService.resetDomain();
      const result = await this.userService.removeById(id);
      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({ id }, this.userService.getErrors());

      return HttpResult.Ok(result);
    } catch (e) {
      return HttpResult.BadRequest({ id }, [
        e.message,
        ...this.userService.getErrors(),
      ]);
    }
  }
}
