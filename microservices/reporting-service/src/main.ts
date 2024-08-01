import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const port = process.env.PORT || 5000;

  await app.listen(port);
  logger.log(`Reporting service is running on: ${await app.getUrl()}`);
}

bootstrap();
