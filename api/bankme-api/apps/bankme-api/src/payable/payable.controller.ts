import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';
import { ZodValidationPipe } from 'bme/core/infra/pipes/zod-validation.pipe';
import {
  changePayableSchema,
  createPayableSchema,
} from 'bme/core/domains/payables/entities/payable.schema';
import { UpdatePayableDto } from './dto/update-payable.dto';

@Controller('integrations/payable')
@ApiTags('Payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a payable',
    type: CreatePayableDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  create(
    @Body(new ZodValidationPipe(createPayableSchema))
    createPayableDto: CreatePayableDto,
  ) {
    return this.payableService.create(createPayableDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Change a payable by id',
    type: UpdatePayableDto,
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(changePayableSchema))
    updateAssignorDto: UpdatePayableDto,
  ) {
    return this.payableService.update(id, updateAssignorDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get list all payables',
    type: CreatePayableDto,
    isArray: true,
  })
  findAll() {
    return this.payableService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get Payable by Id',
    type: CreatePayableDto,
  })
  findOne(@Param('id') id: string) {
    return this.payableService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove payable By Id',
    type: CreatePayableDto,
  })
  remove(@Param('id') id: string) {
    return this.payableService.remove(id);
  }
}
