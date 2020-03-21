import { TourDto } from './tour.dto';
import { PerformanceDto } from './performance.dto';

export class PieceDto {
  readonly title: string;
  readonly composer: string;
  readonly arranger: string;
  readonly code: string;
  readonly tour?: TourDto | string;
  readonly _id?: string;
  readonly videos?: {
    url: string;
    performance: PerformanceDto | string;
  };
}
