import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './api/api.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/statistak', { useNewUrlParser: true }), ApiModule],
  controllers: [AppController],
})
export class AppModule {}
