import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bankme aprove-me')
    .setDescription(
      'Api for application test to try get a chance to join in bankme',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(
    process.env.PORT || 3000,
    process.env.ENV === 'PRODUCTION' ? '0.0.0.0' : undefined,
  );
}
bootstrap();
