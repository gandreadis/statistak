import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ToursModule } from './tours/tours.module';

@Module({
  imports: [ToursModule],
  controllers: [ApiController],
})
export class ApiModule {}
