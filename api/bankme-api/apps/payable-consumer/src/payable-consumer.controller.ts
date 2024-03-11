import { Controller, Get } from '@nestjs/common';
import { PayableConsumerService } from './payable-consumer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class PayableConsumerController {
  constructor(
    private readonly payableConsumerService: PayableConsumerService,
  ) {}

  @Get()
  getHello(): string {
    return this.payableConsumerService.getHello();
  }
}
