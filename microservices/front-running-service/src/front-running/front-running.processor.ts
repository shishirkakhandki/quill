import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FrontRunningService } from './front-running.service';

@Processor('frontRunningQueue')
export class FrontRunningProcessor {
  constructor(private readonly frontRunningService: FrontRunningService) {}

  @Process()
  async handleJob(job: Job) {
    const { address, amount } = job.data;
    try {
      await this.frontRunningService.pauseContract();
      console.log('Contract paused for successfully')
    } catch (error) {
      console.error('Failed to process job:', error);
      throw error;
    }
  }
}
