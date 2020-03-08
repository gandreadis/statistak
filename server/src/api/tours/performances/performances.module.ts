import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from '../../schemas/performance.schema';
import { AuthenticationMiddleware } from '../../authentication.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Performance', schema: PerformanceSchema }])],
  providers: [PerformancesService],
  controllers: [PerformancesController],
})
export class PerformancesModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { method: RequestMethod.POST, path: '/api/performances' },
        { method: RequestMethod.PUT, path: '/api/performances/:performanceId' },
        { method: RequestMethod.DELETE, path: '/api/performances/:performanceId' },
      );
  }
}
