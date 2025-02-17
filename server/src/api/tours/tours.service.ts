import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../interfaces/tour.interface';
import { TourDto } from '../dtos/tour.dto';
import { utils, write, WorkSheet } from 'xlsx-js-style';
import { Performance } from '../interfaces/performance.interface';
import { Piece } from '../interfaces/piece.interface';
import { retryWhen } from 'rxjs';

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

const autoSizeColumns = (dataArray, worksheet) => {
  let objectMaxLength = []
  dataArray.map(rowArray => {
      Object.keys(rowArray).map(key => {
        let value = rowArray[key] === null ? '0000000000' : rowArray[key];
        if (value.length === undefined) return;

        objectMaxLength[key] = objectMaxLength[key] >= value.length ? objectMaxLength[key] : value.length;
      })
    });

    let worksheetCols = objectMaxLength.map(width => { return { width } });
    worksheet["!cols"] = worksheetCols;
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

const performanceTypes = {
  SO: 'Openbaar, bij sociale instelling',
  SB: 'Besloten, bij sociale instelling',
  O: 'Openbaar',
  WO: 'Wild Op (spontaan optreden)',
};

const jaNee = {
  "true": "Ja",
  "false": "Nee",
}


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
    return await this.tourModel.findByIdAndUpdate(tourId, createTourDTO, { new: true }).exec();
  }

  async deleteTour(tourId): Promise<Tour> {
    return await this.tourModel.findByIdAndDelete(tourId).exec();
  }

  async exportToFundingExcel(tourId) {
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
          performance.duration || '?',
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
        row.push(
          jaNee[String(performance.isWithCollection)],
          jaNee[String(performance.isWithCDSale)], 
          jaNee[String(performance.isWithSponsorTalk)],
        );
        data.push(row);
      }),
    );

    const ws: WorkSheet = utils.aoa_to_sheet(data);

    autoSizeColumns(data, ws);

    const excelWorkbook = utils.book_new(); 
    utils.book_append_sheet(excelWorkbook, ws, "Overzicht tour");

    // Return workbook stream
    const excelBuffer = write(excelWorkbook, {type: "buffer", bookType: "xlsx"});
    return excelBuffer;
  }

  async exportToBumaExcel(tourId) {
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

    // Make a workbook that will contain all the data
    const excelWorkbook = utils.book_new(); 

    // Make an overview tab
    const tourOverviewData = [
      [
        'Optreden nr.', 
        'Datum', 
        'Naam uitvoerende(n)', 
        'Naam concert / optreden',
        'Naam locatie concert / optreden', 
        'Doelgroep', 
        'Plaats locatie concert / optreden', 
        'Aantal bezoekers', 
      ],
    ]

    let performanceCounter = 1;
    performanceDays.forEach(performanceDay =>
      performanceDay.performances.map((performance: Performance) => {
        const row = [];
        row.push(
          zeroPad(performanceCounter++, 2),
          performance.date,
          "Ricciotti Ensemble",
          "Optreden",
          performance.locationName,
          performanceTypes[performance.type] ? performanceTypes[performance.type] : '?',
          performance.city,
          performance.audienceCount,
        );
        tourOverviewData.push(row);
      }),
    );

    const tourOverviewWorkSheet: WorkSheet = utils.aoa_to_sheet(tourOverviewData);

    for (const item of ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"]) {
      tourOverviewWorkSheet[item].s = {font: {bold: true}};
    }

    autoSizeColumns(tourOverviewData, tourOverviewWorkSheet);

    utils.book_append_sheet(excelWorkbook, tourOverviewWorkSheet, "Podia opgaven");

    // Make one tab per performance
    performanceCounter = 1;
    performanceDays.forEach(performanceDay =>
      performanceDay.performances.forEach((performance: Performance) => {
        const performanceData = [
          ['Naam uitvoerend artiest(en)', 'Datum optreden', 'Locatie', ''],
          ['Ricciotti Ensemble', performance.date, performance.locationName, ''],
          ['', '', '', ''],
          ['Titel muziekwerk', 'Componist', 'Arrangeur', 'Tijdsduur (min.)'],
        ];

        performance.pieces.forEach(piece => {
          const row = [
            piece.title, 
            piece.composer ? piece.composer : "nvt.", 
            piece.arranger ? piece.arranger : "nvt.",
            piece.duration ? String(piece.duration) : '',
          ];
          performanceData.push(row);
        });
        
        const performanceWorkSheet: WorkSheet = utils.aoa_to_sheet(performanceData);

        for (const item of ["A1", "B1", "C1", "D1", "A4", "B4", "C4", "D4"]) {
          performanceWorkSheet[item].s = {font: {bold: true}};
        }
        autoSizeColumns(performanceData, performanceWorkSheet);
        utils.book_append_sheet(excelWorkbook, performanceWorkSheet, `Rep ${performanceCounter++}`);
      })
    );

    // Return workbook stream
    const excelBuffer = write(excelWorkbook, {type: "buffer", bookType: "xlsx"});
    return excelBuffer;
  }
}
