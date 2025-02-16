import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './api/api.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'build'),
      exclude: ['/api/*name'],
    }),
    MongooseModule.forRoot('mongodb://localhost/statistak'),
    ApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
