import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res } from '@nestjs/common';
import { PerformanceDto } from '../../dtos/performance.dto';
import { ValidateObjectId } from '../../pipes/validate-object-id.pipes';
import { PerformancesService } from './performances.service';

@Controller('api/tours/:tourId/performances')
export class PerformancesController {
  constructor(private performancesService: PerformancesService) {}

  @Post()
  async createPerformance(
    @Param('tourId', new ValidateObjectId()) tourId,
    @Body() createPerformanceDTO: PerformanceDto,
    @Res() res,
  ) {
    const newPerformance = await this.performancesService.createPerformance(createPerformanceDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Performance added successfully!',
      newPerformance,
    });
  }

  @Get(':performanceId')
  async getPerformance(
    @Param('tourId', new ValidateObjectId()) tourId,
    @Param('performanceId', new ValidateObjectId()) performanceId,
    @Res() res,
  ) {
    const performance = await this.performancesService.getPerformance(performanceId);
    if (!performance) {
      throw new NotFoundException('Performance does not exist!');
    }
    return res.status(HttpStatus.OK).json(performance);
  }

  @Get()
  async getPerformances(@Param('tourId', new ValidateObjectId()) tourId, @Res() res) {
    const performances = await this.performancesService.getPerformances(tourId);
    return res.status(HttpStatus.OK).json(performances);
  }

  @Put(':performanceId')
  async editPerformance(
    @Param('tourId', new ValidateObjectId()) tourId,
    @Param('performanceId', new ValidateObjectId()) performanceId,
    @Body() createPerformanceDTO: PerformanceDto,
    @Res() res,
  ) {
    const editedPerformance = await this.performancesService.editPerformance(performanceId, createPerformanceDTO);
    if (!editedPerformance) {
      throw new NotFoundException('Performance does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Performance edited successfully!',
      editedPerformance,
    });
  }

  @Delete(':performanceId')
  async deletePerformance(
    @Param('tourId', new ValidateObjectId()) tourId,
    @Param('performanceId', new ValidateObjectId()) performanceId,
    @Res() res,
  ) {
    const deletedPerformance = await this.performancesService.deletePerformance(performanceId);
    if (!deletedPerformance) {
      throw new NotFoundException('Performance does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Performance deleted successfully!',
      deletedPerformance,
    });
  }
}
