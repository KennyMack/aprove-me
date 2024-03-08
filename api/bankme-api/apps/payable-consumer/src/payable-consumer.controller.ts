import { Controller, Get } from '@nestjs/common';
import { PayableConsumerService } from './payable-consumer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitMQService } from 'bme/core/infra/rabbitmq/rabbit-mq.service';

@Controller()
export class PayableConsumerController {
  constructor(
    private readonly payableConsumerService: PayableConsumerService,
    private readonly rabbit: RabbitMQService,
  ) {}

  //@EventPattern('payable-queue')
  // @MessagePattern('payable-queue')
  @EventPattern()
  public async execute(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();

    console.log('data', data);

    console.log(this.rabbit.getConnectioUrl());

    channel.ack(orginalMessage);
  }

  @Get()
  getHello(): string {
    const { USER_RABBIT } = process.env;
    console.log(USER_RABBIT);
    console.log(process.env.PORT);
    console.log(process.env.VHOST_RABBIT);
    console.log(process.env.DATABASE_URL);
    return this.payableConsumerService.getHello();
  }
}
