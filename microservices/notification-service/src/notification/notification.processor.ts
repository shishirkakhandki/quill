import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from './notification.service';

@Processor('notificationQueue')
export class NotificationProcessor {
  constructor(private readonly notificationService: NotificationService) {}

  @Process()
  async handleNotification(job: Job) {
    const {
      address,
      amount,
      transactionHash,
      blockNumber,
      gasUsed,
      contractAddress,
      exploitType,
      status,
    } = job.data;

    const emailText = `Detected from address: ${address}
    Amount: ${amount}
    Transaction Hash: ${transactionHash}
    Block Number: ${blockNumber}
    Gas Used: ${gasUsed}
    Contract Address: ${contractAddress}
    Exploit Type: ${exploitType}
    Status: ${status}`;

    await this.notificationService.sendEmail('Exploit Detected', emailText);
  }
}
