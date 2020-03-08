import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res
} from '@nestjs/common';
import {ToursService} from "./tours.service";
import {TourDto} from "../dtos/tour.dto";
import {ValidateObjectId} from "../pipes/validate-object-id.pipes";
import { Readable } from 'stream';

@Controller('api/tours')
export class ToursController {
  constructor(private toursService: ToursService) {
  }

  @Post()
  async createTour(@Res() res, @Body() createTourDTO: TourDto) {
    const newTour = await this.toursService.createTour(createTourDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Tour added successfully!',
      newTour,
    });
  }

  @Get(':tourId')
  async getTour(
    @Res() res,
    @Param('tourId', new ValidateObjectId()) tourId,
  ) {
    const tour = await this.toursService.getTour(tourId);
    if (!tour) {
      throw new NotFoundException('Tour does not exist!');
    }
    return res.status(HttpStatus.OK).json(tour);
  }

  @Get()
  async getTours(@Res() res) {
    const tours = await this.toursService.getTours();
    return res.status(HttpStatus.OK).json(tours);
  }

  @Put(':tourId')
  async editTour(
    @Res() res,
    @Param('tourId', new ValidateObjectId()) tourId,
    @Body() createTourDTO: TourDto,
  ) {
    const editedTour = await this.toursService.editTour(tourId, createTourDTO);
    if (!editedTour) {
      throw new NotFoundException('Tour does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Tour edited successfully!',
      editedTour,
    });
  }

  @Delete(':tourId')
  async deleteTour(
    @Res() res,
    @Param('tourId', new ValidateObjectId()) tourId,
  ) {
    const deletedTour = await this.toursService.deleteTour(tourId);
    if (!deletedTour) {
      throw new NotFoundException('Tour does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Tour deleted successfully!',
      deletedTour,
    });
  }

  @Get(':tourId/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=export.csv')
  async getExcelExport(
    @Res() res,
    @Param('tourId', new ValidateObjectId()) tourId,
  ) {
    const s = new Readable();
    s._read = () => {};
    s.push(await this.toursService.exportToExcel(tourId));
    s.push(null);
    return s.pipe(res);
  }
}
