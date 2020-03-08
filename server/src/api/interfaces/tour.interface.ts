import { Document } from 'mongoose';

export class Tour extends Document {
  readonly title: string;
  readonly season: string;
  readonly year: number;
}
