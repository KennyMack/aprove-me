import { ApiProperty } from '@nestjs/swagger';
import { CreatePayableDto } from './create-payable.dto';

export class BatchPayableDto {
  @ApiProperty({ type: CreatePayableDto, isArray: true })
  public payables: CreatePayableDto[];
}
