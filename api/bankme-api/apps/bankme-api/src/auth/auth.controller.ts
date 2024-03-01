import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';
import { ZodValidationPipe } from 'bme/core/infra/pipes/zod-validation.pipe';
import { authUserSchema } from 'bme/core/domains/users/entities/users.schema';

@Controller('integrations/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Authenticate',
    type: AuthUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  auth(@Body(new ZodValidationPipe(authUserSchema)) authUserDto: AuthUserDto) {
    return this.authService.auth(authUserDto);
  }
}
