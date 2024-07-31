import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Exploit } from './reporting.schema';

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel('Exploit') private readonly exploitModel: Model<Exploit>,
    @InjectQueue('reportingQueue') private readonly reportingQueue: Queue,
  ) {}

  async saveExploit(address: string, amount: number): Promise<void> {
    const exploit = new this.exploitModel({ address, amount });
    try {
      await exploit.save();
      console.log('Exploit saved to database');
    } catch (error) {
      console.error('Failed to save exploit:', error);
      throw error;
    }
  }

  async addJob(address: string, amount: number): Promise<void> {
    try {
      await this.reportingQueue.add({ address, amount });
      console.log('Job added to queue');
    } catch (error) {
      console.error('Failed to add job to queue:', error);
      throw error;
    }
  }
}
