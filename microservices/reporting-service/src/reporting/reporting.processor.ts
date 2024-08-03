import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportingService } from './reporting.service';
import { Logger } from '@nestjs/common';

@Processor('reportingQueue')
export class ReportingProcessor {
  private readonly logger = new Logger(ReportingProcessor.name);

  constructor(private readonly reportingService: ReportingService) {}

  @Process()
  async handleJob(job: Job) {
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

    this.logger.log(
      `Processing job with data: address: ${address}, amount: ${amount}, transactionHash: ${transactionHash}, blockNumber: ${blockNumber}, gasUsed: ${gasUsed}, contractAddress: ${contractAddress}, exploitType: ${exploitType}, status: ${status}`,
    );

    try {
      await this.reportingService.saveExploit({
        address,
        amount,
        transactionHash,
        blockNumber,
        gasUsed,
        contractAddress,
        exploitType,
        status,
      });
      this.logger.log('Job processed successfully');
    } catch (error) {
      this.logger.error('Failed to process job:', error.stack);
      throw error;
    }
  }
}
