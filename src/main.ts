import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настроим Swagger
  const config = new DocumentBuilder()
    .setTitle('Traffic Stats API')
    .setDescription('API для получения статистики посещений')
    .setVersion('1.0')
    .addTag('traffic-stats') // Тег для группировки
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Путь для документации будет доступен по /api

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
