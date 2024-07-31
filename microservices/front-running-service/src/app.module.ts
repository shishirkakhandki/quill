import { Module } from '@nestjs/common';
import { FrontRunningModule } from './front-running/front-running.module';
import { ConfigModule } from './common/config.module';

@Module({
  imports: [ConfigModule, FrontRunningModule],
})
export class AppModule {}
