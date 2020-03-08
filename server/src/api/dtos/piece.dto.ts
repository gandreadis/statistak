import { TourDto } from './tour.dto';

export class PieceDto {
  readonly title: string;
  readonly composer: string;
  readonly arranger: string;
  readonly code: string;
  readonly tour?: TourDto | string;
}
