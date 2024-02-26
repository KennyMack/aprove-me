import { PartialType } from '@nestjs/mapped-types';
import { CreatePayableDto } from './create-payable.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePayableDto extends PartialType(CreatePayableDto) {
  @ApiProperty()
  public id: string;
}
