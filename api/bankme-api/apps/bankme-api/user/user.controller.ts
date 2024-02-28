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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../src/interceptors/http-status.interceptor';

@Controller('integrations/user')
@ApiTags('Authentication')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create an user',
    type: CreateUserDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user list',
    isArray: true,
    type: CreateUserDto,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user By Id',
    type: CreateUserDto,
  })
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove user By Id',
    type: CreateUserDto,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
