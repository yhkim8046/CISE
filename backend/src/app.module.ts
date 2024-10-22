import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './api/module/Article.Module';
import { ModeratorModule } from './api/module/Moderator.Module';

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
