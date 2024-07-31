import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'notificationQueue' },
      { name: 'frontRunningQueue' },
      { name: 'reportingQueue' },
    ),
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
