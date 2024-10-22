import { Module } from '@nestjs/common';
import { ArticleController } from '../controllers/Article.Controller';
import { ArticleService } from '../services/ArticleService';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../models/Article.Schema';
import { ModeratorModule } from './Moderator.Module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ModeratorModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
