import { PieceDto } from './piece.dto';
import { TourDto } from './tour.dto';

export class PerformanceDto {
  readonly locationName: string;
  readonly city: string;
  readonly country: string;
  readonly date: string;
  readonly time: string;
  readonly isOutside: boolean;
  readonly type: string;
  readonly audienceCount: number;
  readonly guestConductor: string;
  readonly isWithCollection: boolean;
  readonly isWithCDSale: boolean;
  readonly isWithSponsorTalk: boolean;
  readonly comments: string;
  readonly pieces: PieceDto[];
  readonly tour?: TourDto | string;
}
