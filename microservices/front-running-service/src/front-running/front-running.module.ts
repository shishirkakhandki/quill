import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FrontRunningService } from './front-running.service';
import { FrontRunningProcessor } from './front-running.processor';
import { ConfigModule } from '../common/config.module';
import { ConfigService } from '../common/config.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.redisUrl,
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'frontRunningQueue',
    }),
  ],
  providers: [FrontRunningService, FrontRunningProcessor],
})
export class FrontRunningModule {}
