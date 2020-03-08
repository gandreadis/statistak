import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../interfaces/tour.interface';
import { TourDto } from '../dtos/tour.dto';
import { utils, WorkSheet } from 'xlsx';
import { Performance } from '../interfaces/performance.interface';
import { Piece } from '../interfaces/piece.interface';

const arrayPropertyComparator = (property: string) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a: any, b: any) => {
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

@Injectable()
export class ToursService {
  constructor(
    @InjectModel('Tour') private readonly tourModel: Model<Tour>,
    @InjectModel('Performance') private readonly performanceModel: Model<Performance>,
    @InjectModel('Piece') private readonly pieceModel: Model<Piece>,
  ) {}

  async createTour(createTourDTO: TourDto): Promise<Tour> {
    const newTour = await new this.tourModel(createTourDTO);
    return newTour.save();
  }

  async getTour(tourId): Promise<Tour> {
    return await this.tourModel.findById(tourId).exec();
  }

  async getTours(): Promise<Tour[]> {
    return await this.tourModel.find().exec();
  }

  async editTour(tourId, createTourDTO: TourDto): Promise<Tour> {
    return await this.tourModel.findByIdAndUpdate(tourId, createTourDTO, { new: true });
  }

  async deleteTour(tourId): Promise<Tour> {
    return await this.tourModel.findByIdAndRemove(tourId);
  }

  async exportToExcel(tourId): Promise<string> {
    const allPerformances = await this.performanceModel
      .find({ tour: tourId })
      .populate('pieces')
      .exec();
    const performancesByDate = {};
    allPerformances.forEach(performance => {
      if (performancesByDate.hasOwnProperty(performance.date)) {
        performancesByDate[performance.date].push(performance);
      } else {
        performancesByDate[performance.date] = [performance];
      }
    });

    const performanceDays = [];

    for (const date in performancesByDate) {
      if (performancesByDate.hasOwnProperty(date)) {
        performancesByDate[date].sort(arrayPropertyComparator('time'));
        performanceDays.push({
          date,
          performances: performancesByDate[date],
        });
      }
    }

    performanceDays.sort(arrayPropertyComparator('date'));

    const data = [];
    data.push([
      'Nummer',
      'Datum',
      'Tijd',
      'Duur',
      'Locatie',
      'Stad',
      'Stadsdeel',
      'Buurtactiviteit',
      'Provincie',
      'O/SO/SB/WO',
      'Doelgroep',
      'Publiek',
      'Gastdirirgent',
      'Repertoire (niet op volgorde)',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      'Mansen',
      'CD verkoop',
      'Groupies',
      'Opmerking Groupies',
      'Uitkoop',
      'Maaltijden',
      'Extra',
      'Opmerking',
      'Contactpersoon',
    ]);

    let counter = 1;
    performanceDays.forEach(performanceDay =>
      performanceDay.performances.map((performance: Performance) => {
        const row = [];
        row.push(
          counter++,
          performance.date,
          performance.time,
          '?',
          performance.locationName,
          performance.city,
          '',
          '',
          '',
          performance.type,
          '',
          performance.audienceCount,
          performance.guestConductor,
          '',
        );
        performance.pieces.map(piece => piece.code).forEach(piece => row.push(piece));
        while (row.length < 37) {
          row.push('');
        }
        row.push(performance.isWithCollection, performance.isWithCDSale, performance.isWithSponsorTalk);
        data.push(row);
      }),
    );

    const ws: WorkSheet = utils.aoa_to_sheet(data);
    return utils.sheet_to_csv(ws);
  }
}
