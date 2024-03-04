import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  public login: string;
  @ApiProperty()
  public password: string;
}
