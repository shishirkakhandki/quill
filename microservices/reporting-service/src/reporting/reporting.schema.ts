import { Schema, Document } from 'mongoose';

export const ExploitSchema = new Schema(
  {
    address: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: 'Exploit' },
);

export interface Exploit extends Document {
  address: string;
  amount: number;
  timestamp: Date;
}