import { NestFactory } from '@nestjs/core';
import { PayableConsumerModule } from './payable-consumer.module';

async function bootstrap() {
  //const app = await NestFactory.create(PayableConsumerModule);

  //console.log(process.env.VHOST_RABBIT);
  //app.listen(4000);

  const app = await NestFactory.createMicroservice(PayableConsumerModule);

  // await app.listenAsync();

  await app.listen();
}
bootstrap();
