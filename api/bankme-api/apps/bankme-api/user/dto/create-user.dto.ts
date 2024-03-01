import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public password: string;
}
