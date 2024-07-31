import { Module } from '@nestjs/common';
import { ReportingModule } from './reporting/reporting.module';
import { ConfigModule } from './common/config.module';

@Module({
  imports: [ConfigModule, ReportingModule],
})
export class AppModule {}
