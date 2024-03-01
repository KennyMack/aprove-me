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
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';

@Controller('integrations/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create an user',
    type: CreateAuthDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user list',
    isArray: true,
    type: CreateAuthDto,
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user By Id',
    type: CreateAuthDto,
  })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Change user By Id',
    type: UpdateAuthDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove user By Id',
    type: CreateAuthDto,
  })
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
