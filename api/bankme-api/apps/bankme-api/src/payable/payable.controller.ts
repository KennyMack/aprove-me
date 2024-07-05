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
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpStatusInterceptor } from '../interceptors/http-status.interceptor';
import { ZodValidationPipe } from 'bme/core/infra/pipes/zod-validation.pipe';
import {
  batchPayableSchema,
  changePayableSchema,
  createPayableSchema,
} from 'bme/core/domains/payables/entities/payable.schema';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { BatchPayableDto } from './dto/create-batch.payable.dto';
import { AllowAnonymous } from '../decorators/allow-anonymous.decorator';

@Controller('integrations/payable')
@ApiBearerAuth()
@ApiTags('Payable')
@AllowAnonymous()
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

  @Post('batch')
  @ApiResponse({
    status: 201,
    description: 'Import a batch of payables',
    type: BatchPayableDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  batch(
    @Body(new ZodValidationPipe(batchPayableSchema))
    batchPayableDto: BatchPayableDto,
  ) {
    return this.payableService.batch(batchPayableDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Change a payable by id',
    type: UpdatePayableDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
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
  @UseInterceptors(HttpStatusInterceptor)
  findAll() {
    return this.payableService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get Payable by Id',
    type: CreatePayableDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  findOne(@Param('id') id: string) {
    return this.payableService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Remove payable By Id',
    type: CreatePayableDto,
  })
  @UseInterceptors(HttpStatusInterceptor)
  remove(@Param('id') id: string) {
    return this.payableService.remove(id);
  }
}
