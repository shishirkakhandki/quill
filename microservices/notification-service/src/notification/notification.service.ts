import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as mailgun from 'mailgun-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private mg;

  constructor(
    @InjectQueue('notificationQueue') private notificationQueue: Queue,
    private configService: ConfigService,
  ) {
    this.mg = mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KEY'),
      domain: this.configService.get<string>('MAILGUN_DOMAIN'),
    });
  }

  async sendEmail(subject: string, text: string): Promise<void> {
    const data = {
      from: this.configService.get<string>('EMAIL'),
      to: this.configService.get<string>('NOTIFY_EMAIL'),
      subject,
      text,
    };

    try {
      await this.mg.messages().send(data);
      this.logger.log('Email sent:', subject);
    } catch (error) {
      this.logger.error('Failed to send email:', error.stack);
      throw error;
    }
  }
}
