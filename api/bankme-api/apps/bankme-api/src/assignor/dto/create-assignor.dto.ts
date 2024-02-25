import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorDto {
  @ApiProperty()
  public document: string;
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public phone: string;
  @ApiProperty()
  public name: string;
}
