import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './api/controllers/article.controller';
import { ArticleService } from './api/services/articleService';
import { ArticleSchema } from './api/models/article.schema';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.DB_URI || ''), // Connect to MongoDB
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  controllers: [AppController, ArticleController],
  providers: [AppService,ArticleService]
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
