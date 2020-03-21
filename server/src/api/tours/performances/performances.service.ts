import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Performance } from '../../interfaces/performance.interface';
import { PerformanceDto } from '../../dtos/performance.dto';

@Injectable()
export class PerformancesService {
  constructor(@InjectModel('Performance') private readonly performanceModel: Model<Performance>) {}

  async createPerformance(createPerformanceDTO: PerformanceDto): Promise<Performance> {
    const newPerformance = await new this.performanceModel(createPerformanceDTO);
    return newPerformance.save();
  }

  async getPerformance(performanceId): Promise<Performance> {
    return await this.performanceModel
      .findById(performanceId)
      .populate('pieces')
      .populate('videos.pieces')
      .exec();
  }

  async getPerformances(tourId: string): Promise<Performance[]> {
    return await this.performanceModel
      .find({ tour: tourId })
      .populate('pieces')
      .populate('videos.pieces')
      .exec();
  }

  async editPerformance(performanceId, createPerformanceDTO: PerformanceDto): Promise<Performance> {
    return await this.performanceModel
      .findByIdAndUpdate(performanceId, createPerformanceDTO, { new: true })
      .populate('pieces')
      .populate('videos.pieces')
      .exec();
  }

  async deletePerformance(performanceId): Promise<Performance> {
    return await this.performanceModel
      .findByIdAndRemove(performanceId)
      .populate('pieces')
      .populate('videos.pieces')
      .exec();
  }
}
