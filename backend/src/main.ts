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
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    logger.log('Database connected successfully');
  } catch (err) {
    logger.error('Database connection error:', err.message);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors(); // This enables CORS for all origins

  await app.listen(process.env.PORT); // Let Vercel manage the port
};

bootstrap();
