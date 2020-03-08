import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from '../../schemas/performance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Performance', schema: PerformanceSchema }])],
  providers: [ChartsService],
  controllers: [ChartsController],
})
export class ChartsModule {}
