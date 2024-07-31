import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as mailgun from 'mailgun-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private mg;

  constructor(
    @InjectQueue('notificationQueue') private notificationQueue: Queue,
    private configService: ConfigService,
  ) {
    this.mg = mailgun({
      apiKey: this.configService.get('MAILGUN_API_KEY'),
      domain: this.configService.get('MAILGUN_DOMAIN'),
    });
    this.notificationQueue.process(async (job) => {
      const { address, amount } = job.data;
      try {
        await this.sendEmail('Exploit Detected', `Detected from address: ${address}, amount: ${amount}`);
      } catch (error) {
        console.error('Failed to process job:', error);
        throw error; // Retry logic in queue will handle this
      }
    });
  }

  async sendEmail(subject: string, text: string): Promise<void> {
    const data = {
      from: this.configService.get('EMAIL'),
      to: this.configService.get('NOTIFY_EMAIL'),
      subject,
      text,
    };

    try {
      await this.mg.messages().send(data);
      console.log('Email sent:', subject);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error; // Retry logic in queue will handle this
    }
  }

  async addToQueue(address: string, amount: number): Promise<void> {
    await this.notificationQueue.add({ address, amount });
  }
}
