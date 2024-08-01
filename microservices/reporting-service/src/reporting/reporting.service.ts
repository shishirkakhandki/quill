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

  async saveExploit(address: string, amount: number): Promise<void> {
    const exploit = new this.exploitModel({ address, amount });
    try {
      await exploit.save();
      this.logger.log('Exploit saved to database');
    } catch (error) {
      this.logger.error('Failed to save exploit:', error.stack);
      throw error;
    }
  }

  async addJob(address: string, amount: number): Promise<void> {
    try {
      await this.reportingQueue.add({ address, amount });
      this.logger.log('Job added to queue');
    } catch (error) {
      this.logger.error('Failed to add job to queue:', error.stack);
      throw error;
    }
  }
}
