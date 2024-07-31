import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
