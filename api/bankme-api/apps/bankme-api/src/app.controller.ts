import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}

  @AllowAnonymous()
  @Get()
  @Redirect('/swagger')
  goToSwagger() {}
}
