import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ALLOW_ANONYMOUS } from '../decorators/allow-anonymous.decorator';
import { HttpVO } from 'bme/core/http/http.vo';
import { Fails } from 'bme/core/messages/fails';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS,
      [context.getHandler(), context.getClass()],
    );
    if (isAnonymous) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.getDataFromHeader(request);
    if (!token) {
      const result = new HttpVO(false, HttpStatus.UNAUTHORIZED, {}, [
        Fails.UNAUTHORIZED,
      ]);
      throw new UnauthorizedException(result);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.MORDOR_PHRASE,
      });
      request['user'] = payload;
    } catch {
      const result = new HttpVO(false, HttpStatus.UNAUTHORIZED, {}, [
        Fails.UNAUTHORIZED,
      ]);
      throw new UnauthorizedException(result);
    }
    return true;
  }

  private getDataFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
