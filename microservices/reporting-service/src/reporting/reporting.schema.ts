import { Schema, Document } from 'mongoose';

export const ExploitSchema = new Schema(
  {
    address: String,
    amount: Number,
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number,
    contractAddress: String,
    exploitType: String,
    status: String,
  },
  { collection: 'Exploit' },
);

export interface Exploit extends Document {
  address: string;
  amount: number;
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  contractAddress: string;
  exploitType: string;
  status: string;
}
