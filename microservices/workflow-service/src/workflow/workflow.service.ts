import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectQueue('notificationQueue') private notificationQueue: Queue,
    @InjectQueue('frontRunningQueue') private frontRunningQueue: Queue,
    @InjectQueue('reportingQueue') private reportingQueue: Queue,
  ) {}

  async addJobsToQueues(data: { address: string; amount: number }) {
    const results = await Promise.allSettled([
      this.addToQueue(this.notificationQueue, 'notification', data),
      this.addToQueue(this.reportingQueue, 'reporting', data),
      this.addToQueue(this.frontRunningQueue, 'frontRunning', data),
    ]);

    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some jobs failed to be added to queues:', failures);
    }

    return results;
  }

  private async addToQueue(
    queue: Queue,
    queueName: string,
    data: any,
  ): Promise<void> {
    try {
      await queue.add(data);
      console.log(`Job added to ${queueName} queue`);
    } catch (error) {
      console.error(`Failed to add job to ${queueName} queue:`, error);
      throw error;
    }
  }
}
