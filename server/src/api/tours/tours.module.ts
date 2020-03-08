import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {ToursController} from './tours.controller';
import {ToursService} from './tours.service';
import {MongooseModule} from "@nestjs/mongoose";
import {TourSchema} from "../schemas/tour.schema";
import {AuthenticationMiddleware} from "../authentication.middleware";
import {PerformancesModule} from "./performances/performances.module";
import {ChartsModule} from "./charts/charts.module";
import {PiecesModule} from "./pieces/pieces.module";
import {PerformanceSchema} from "../schemas/performance.schema";
import {PieceSchema} from "../schemas/piece.schema";
import {StatsModule} from "./stats/stats.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Tour', schema: TourSchema},
      {name: 'Performance', schema: PerformanceSchema},
      {name: 'Piece', schema: PieceSchema},
    ]),
    PerformancesModule,
    ChartsModule,
    StatsModule,
    PiecesModule
  ],
  controllers: [ToursController],
  providers: [ToursService]
})
export class ToursModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        {method: RequestMethod.POST, path: '/api/tours'},
        {method: RequestMethod.PUT, path: '/api/tours/:tourId'},
        {method: RequestMethod.DELETE, path: '/api/tours/:tourId'},
      );
  }
}
