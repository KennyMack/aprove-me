import { Inject, Injectable } from '@nestjs/common';
import { UserDomainService } from 'bme/core/domains/users/user-service';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { HttpResult } from 'bme/core/http/http-result';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserDomainService)
    protected userService: IUserDomainService,
  ) {}

  async auth(userAuthDto: AuthUserDto) {
    try {
      this.userService.resetDomain();

      const authResult = await this.userService.auth(
        userAuthDto.login,
        userAuthDto.password,
      );

      const errors = this.userService.getErrors();

      if (errors.length)
        return HttpResult.Unauthorized(
          {
            login: userAuthDto.login,
          },
          this.userService.getErrors(),
        );

      return HttpResult.Ok(authResult);
    } catch (e) {
      return HttpResult.Unauthorized(
        {
          login: userAuthDto.login,
        },
        [e.message, ...this.userService.getErrors()],
      );
    }
  }
}
