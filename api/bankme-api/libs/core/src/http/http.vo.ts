import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class HttpVO {
  constructor(
    public readonly success: boolean,
    public readonly httpStatusCode: HttpStatus,
    public readonly body: any,
    public readonly errors: string[],
  ) {}
}
