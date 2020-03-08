import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ValidateObjectId } from '../../pipes/validate-object-id.pipes';

@Controller('api/tours/:tourId/charts')
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Get()
  async getCharts(@Param('tourId', new ValidateObjectId()) tourId, @Res() res) {
    const chartsEntries = await this.chartsService.getCharts(tourId);
    return res.status(HttpStatus.OK).json(chartsEntries);
  }
}
