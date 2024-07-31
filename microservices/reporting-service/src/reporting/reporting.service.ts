import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exploit } from './reporting.schema';

@Injectable()
export class ReportingService {
  constructor(@InjectModel('Exploit') private readonly exploitModel: Model<Exploit>) {}

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
}
