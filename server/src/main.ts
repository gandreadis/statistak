import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as compression from 'compression';

dotenv.config();

async function bootstrap() {
  let options = {};

  if (process.env.SERVER_PORT == '443') {
    options = {
      httpsOptions: {
        key: fs.readFileSync('/etc/letsencrypt/live/statistak.nl/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/statistak.nl/cert.pem'),
      },
    };
  }

  const app = await NestFactory.create(AppModule, options);
  app.use(compression());
  app.enableCors();
  await app.listen(process.env.SERVER_PORT || 12345);
}

bootstrap();
