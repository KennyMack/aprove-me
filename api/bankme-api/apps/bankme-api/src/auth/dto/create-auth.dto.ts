import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public password: string;
}
