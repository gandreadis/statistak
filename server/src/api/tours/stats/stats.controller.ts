import {Controller, Get, HttpStatus, Param, Res} from '@nestjs/common';
import {StatsService} from "./stats.service";
import {ValidateObjectId} from "../../pipes/validate-object-id.pipes";

@Controller('api/tours/:tourId/stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStats(@Param("tourId", new ValidateObjectId()) tourId, @Res() res) {
    const stats = await this.statsService.getStats(tourId);
    return res.status(HttpStatus.OK).json(stats);
  }
}
