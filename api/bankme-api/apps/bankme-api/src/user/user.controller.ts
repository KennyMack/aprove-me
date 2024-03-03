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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';
import { ZodValidationPipe } from 'bme/core/infra/pipes/zod-validation.pipe';
import { createUserSchema } from 'bme/core/domains/users/entities/users.schema';

@Controller('integrations/user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create an user',
    type: CreateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user list',
    isArray: true,
    type: CreateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user By Id',
    type: CreateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Change user By Id',
    type: UpdateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove user By Id',
    type: CreateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
