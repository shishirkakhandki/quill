import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const logger = new Logger('Bootstrap');

  await app.listen(port, () => {
    logger.log(`Notification service listening at http://localhost:${port}`);
  });
}
bootstrap();
