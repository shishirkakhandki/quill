import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        const logger = new Logger('AppModule');
        logger.log(`Connecting to MongoDB with URI: ${mongoUri}`);

        if (
          !mongoUri.startsWith('mongodb://') &&
          !mongoUri.startsWith('mongodb+srv://')
        ) {
          throw new Error('Invalid MongoDB URI');
        }

        return {
          uri: mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    ReportingModule,
  ],
})
export class AppModule {}
