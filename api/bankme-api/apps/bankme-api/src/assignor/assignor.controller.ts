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
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';
import {
  changeAssignorSchema,
  createAssignorSchema,
} from 'bme/core/domains/assignors/entities/assignor.schema';
import { ZodValidationPipe } from 'bme/core/infra/pipes/zod-validation.pipe';

@Controller('integrations/assignor')
@ApiBearerAuth()
@ApiTags('Assignor')
export class AssignorController {
  constructor(private readonly assignorService: AssignorService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create an assignor',
    type: CreateAssignorDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  create(
    @Body(new ZodValidationPipe(createAssignorSchema))
    createAssignorDto: CreateAssignorDto,
  ) {
    return this.assignorService.create(createAssignorDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Change an assignor by id',
    type: UpdateAssignorDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(changeAssignorSchema))
    updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorService.update(id, updateAssignorDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'list all assignors',
    isArray: true,
    type: CreateAssignorDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  findAll() {
    return this.assignorService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get an assignor by id',
    type: CreateAssignorDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  findOne(@Param('id') id: string) {
    return this.assignorService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove an assignor by id',
    type: CreateAssignorDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  remove(@Param('id') id: string) {
    return this.assignorService.remove(id);
  }
}
