import { Module } from '@nestjs/common';
import { ArticleController } from '../controllers/Article.controller';
import { ArticleService } from '../services/ArticleService';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../models/Article.schema';
import { ModeratorModule } from './Moderator.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ModeratorModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
