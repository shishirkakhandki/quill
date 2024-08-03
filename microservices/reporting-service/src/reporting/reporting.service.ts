import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Exploit } from './reporting.schema';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    @InjectModel('Exploit') private readonly exploitModel: Model<Exploit>,
    @InjectQueue('reportingQueue') private readonly reportingQueue: Queue,
  ) {}

  async saveExploit(data: {
    address: string;
    amount: number;
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
    contractAddress: string;
    exploitType: string;
    status: string;
  }): Promise<void> {
    const exploit = new this.exploitModel(data);
    try {
      await exploit.save();
      this.logger.log('Exploit saved to database');
    } catch (error) {
      this.logger.error('Failed to save exploit:', error.stack);
      throw error;
    }
  }

  async addJob(data: {
    address: string;
    amount: number;
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
    contractAddress: string;
    exploitType: string;
    status: string;
  }): Promise<void> {
    try {
      await this.reportingQueue.add(data);
      this.logger.log('Job added to queue');
    } catch (error) {
      this.logger.error('Failed to add job to queue:', error.stack);
      throw error;
    }
  }
}
