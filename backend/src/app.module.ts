import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.DB_URI || ''), // Connect to MongoDB
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    if (!process.env.DB_URI) {
      console.error('Error: DB_URI environment variable is not set.');
    } else {
      console.log('MongoDB URI:', process.env.DB_URI);
    }
  }
}
