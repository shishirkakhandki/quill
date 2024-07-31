import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from './notification.service';

@Processor('notificationQueue')
export class NotificationProcessor {
  constructor(private readonly notificationService: NotificationService) {}

  @Process()
  async handleNotification(job: Job) {
    const { address, amount } = job.data;
    await this.notificationService.sendEmail('Exploit Detected', `Detected from address: ${address}, amount: ${amount}`);
  }
}
