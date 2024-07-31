import { Injectable, Inject } from '@nestjs/common';
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
    try {
      await Promise.all([
        this.notificationQueue.add(data),
        this.frontRunningQueue.add(data),
        this.reportingQueue.add(data),
      ]);
      console.log('Jobs added to queues');
    } catch (error) {
      console.error('Failed to add jobs to queues:', error);
      throw error;
    }
  }
}
