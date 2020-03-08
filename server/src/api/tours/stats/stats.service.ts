import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Performance} from "../../interfaces/performance.interface";
import {StatsDto} from "../../dtos/stats.dto";

@Injectable()
export class StatsService {
  constructor(@InjectModel('Performance') private readonly performanceModel: Model<Performance>) {
  }

  static transformPerformanceTypeArray(array: any[]): any {
    const countries: {[key: string]: object} = {};

    array.map(typeObject => {
      if (!countries[typeObject._id.country]) {
        countries[typeObject._id.country] = {};
      }
      countries[typeObject._id.country][typeObject._id.type] = typeObject.numPerformances;
    });

    return Object.entries(countries).map(([key, value]) => ({
      _id: key,
      ...value,
    }));
  }

  static sortById(array: any[]) {
    array.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
  }

  async getStats(tourId: string): Promise<StatsDto> {
    const audienceCounts = await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId)}},
        {$group: {_id: "$country", audienceCount: {$sum: '$audienceCount'}}},
      ]);
    StatsService.sortById(audienceCounts);

    const meanNumPerformancesPerDay = await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId)}},
        {$group: {_id: {"date": "$date", "country": "$country"}, numPerformances: {$sum: 1}}},
        {$group: {_id: "$_id.country", meanNumPerformances: {$avg: '$numPerformances'}}},
      ]);
    StatsService.sortById(meanNumPerformancesPerDay);

    const numPerformances = await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId)}},
        {$group: {_id: "$country", numPerformances: {$sum: 1}}},
      ]);
    StatsService.sortById(numPerformances);

    const numPerformancesByType = StatsService.transformPerformanceTypeArray(
      await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId)}},
        {$group: {_id: {country: "$country", type: "$type"}, numPerformances: {$sum: 1}}},
      ])
    );
    StatsService.sortById(numPerformancesByType);

    const numPerformancesOutside = await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId), isOutside: true}},
        {$group: {_id: "$country", numPerformances: {$sum: 1}}},
      ]);
    StatsService.sortById(numPerformancesOutside);

    const numPerformancesPerDay = await this.performanceModel.aggregate([
        {$match: {tour: new Types.ObjectId(tourId)}},
        {$group: {_id: "$date", numPerformances: {$sum: 1}}},
      ]);
    StatsService.sortById(numPerformancesPerDay);

    return {
      audienceCounts,
      meanNumPerformancesPerDay,
      numPerformances,
      numPerformancesByType,
      numPerformancesOutside,
      numPerformancesPerDay,
    };
  }
}
