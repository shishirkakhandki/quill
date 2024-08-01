import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);

  const logger = new Logger('Bootstrap');
  logger.log(`Front-running service listening at http://localhost:4000`);
}

bootstrap();
