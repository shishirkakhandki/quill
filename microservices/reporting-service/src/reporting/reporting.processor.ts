import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportingService } from './reporting.service';

@Processor('reportingQueue')
export class ReportingProcessor {
  constructor(private readonly reportingService: ReportingService) {}

  @Process()
  async handleJob(job: Job) {
    const { address, amount } = job.data;
    console.log('Processing job with address:', address, 'amount:', amount);
    try {
      await this.reportingService.saveExploit(address, amount);
    } catch (error) {
      console.error('Failed to process job:', error);
      throw error;
    }
  }
}
