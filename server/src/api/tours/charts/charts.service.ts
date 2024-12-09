import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Performance } from '../../interfaces/performance.interface';
import { ChartsEntryDto } from '../../dtos/charts.dto';
import { Piece } from 'src/api/interfaces/piece.interface';

@Injectable()
export class ChartsService {
  constructor(@InjectModel('Performance') private readonly performanceModel: Model<Performance>) {}

  async getCharts(tourId: string): Promise<ChartsEntryDto[]> {
    const performances = await this.performanceModel
      .find({ tour: tourId })
      .populate('pieces')
      .exec();
    const pieces = {};
    performances.forEach(performance =>
      performance.pieces.forEach((piece: Piece) => {
        if (!pieces.hasOwnProperty(piece._id as string)) {
          pieces[piece._id as string] = {
            numberOfPerformances: 0,
            audienceCount: 0,
            piece,
          };
        }

        pieces[piece._id as string].numberOfPerformances += 1;
        pieces[piece._id as string].audienceCount += performance.audienceCount;
      }),
    );

    return Object.values(pieces);
  }
}
