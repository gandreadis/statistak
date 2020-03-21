import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PieceSchema } from '../../schemas/piece.schema';
import { AuthenticationMiddleware } from '../../authentication.middleware';
import { PerformanceSchema } from '../../schemas/performance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Piece', schema: PieceSchema },
      { name: 'Performance', schema: PerformanceSchema },
    ]),
  ],
  providers: [PiecesService],
  controllers: [PiecesController],
})
export class PiecesModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { method: RequestMethod.POST, path: '/api/pieces' },
        { method: RequestMethod.PUT, path: '/api/pieces/:pieceId' },
        { method: RequestMethod.DELETE, path: '/api/pieces/:pieceId' },
      );
  }
}
