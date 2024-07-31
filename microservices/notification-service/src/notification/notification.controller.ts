import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/exploit-detected')
  async handleExploitDetection(@Body() body: { address: string; amount: number }) {
    const { address, amount } = body;
    if (!address || !amount) {
      throw new Error('Missing address or amount');
    }
    await this.notificationService.addToQueue(address, amount);
    return 'Notification sent';
  }
}
