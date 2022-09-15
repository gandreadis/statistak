import { Document } from 'mongoose';
import { Piece } from './piece.interface';
import { Tour } from './tour.interface';

export interface Performance extends Document {
  readonly locationName: string;
  readonly city: string;
  readonly country: string;
  readonly date: string;
  readonly time: string;
  readonly duration: number;
  readonly isOutside: boolean;
  readonly type: string;
  readonly audienceCount: number;
  readonly guestConductor: string;
  readonly isWithCollection: boolean;
  readonly isWithCDSale: boolean;
  readonly isWithSponsorTalk: boolean;
  readonly comments: string;
  readonly videos: {
    url: string;
    pieces: Piece[];
  }[];
  readonly pieces: Piece[];
  readonly tour: Tour | string;
}
