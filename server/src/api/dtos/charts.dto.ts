import {PieceDto} from "./piece.dto";

export class ChartsEntryDto {
  readonly numberOfPerformances: number;
  readonly audienceCount: number;
  readonly piece: PieceDto;
}
