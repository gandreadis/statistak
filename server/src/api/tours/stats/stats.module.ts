import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from '../../schemas/performance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Performance', schema: PerformanceSchema }])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
