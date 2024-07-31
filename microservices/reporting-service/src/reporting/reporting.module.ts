import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ReportingService } from './reporting.service';
import { ReportingProcessor } from './reporting.processor';
import { ExploitSchema } from './reporting.schema';
import { ConfigModule } from '../common/config.module';
import { ConfigService } from '../common/config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongoUri,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Exploit', schema: ExploitSchema }]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.redisUrl,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'reportingQueue',
    }),
  ],
  providers: [ReportingService, ReportingProcessor],
})
export class ReportingModule {}
