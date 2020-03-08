import { Document } from 'mongoose';
import { Tour } from './tour.interface';

export class Piece extends Document {
  readonly title: string;
  readonly composer: string;
  readonly arranger: string;
  readonly code: string;
  readonly tour: Tour;
}
