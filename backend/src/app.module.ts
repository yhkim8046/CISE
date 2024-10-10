import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './api/module/artiecle.module';
import { ModeratorModule } from './api/module/Moderator.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI || '', {
      dbName: 'test', 
    }),
    ArticleModule,
    ModeratorModule,
  ],
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
