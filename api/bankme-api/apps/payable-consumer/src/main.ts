import { NestFactory } from '@nestjs/core';
import { PayableConsumerModule } from './payable-consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PayableConsumerModule);

  await app.listen();
}
bootstrap();
