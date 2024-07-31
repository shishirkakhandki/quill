import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 5000;

  await app.listen(port);
  console.log(`Reporting service is running on: ${await app.getUrl()}`);
}

bootstrap();
