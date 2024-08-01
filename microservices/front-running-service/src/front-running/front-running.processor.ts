import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FrontRunningService } from './front-running.service';
import { Logger } from '@nestjs/common';

@Processor('frontRunningQueue')
export class FrontRunningProcessor {
  private readonly logger = new Logger(FrontRunningProcessor.name);

  constructor(private readonly frontRunningService: FrontRunningService) {}

  @Process()
  async handleJob(job: Job) {
    const { address, amount } = job.data;
    try {
      await this.frontRunningService.pauseContract();
      this.logger.log('Contract paused successfully');
    } catch (error) {
      this.logger.error('Failed to process job:', error);
      throw error;
    }
  }
}
