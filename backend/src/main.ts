import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const dbUri = process.env.DB_URI;
  const logger = new ConsoleLogger('Bootstrap');
  logger.log(`DB_URI: ${dbUri}`);

  try {
    //DB connection  
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    logger.log('Database connected successfully');
  } catch (err) {
    logger.error('Database connection error:', err.message);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://cise-front.vercel.app'], // allowing frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
  });

  const port = process.env.PORT || 3000; 
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
