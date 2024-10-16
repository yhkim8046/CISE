import { Module } from '@nestjs/common';
import { ArticleController } from '../controllers/article.controller';
import { ArticleService } from '../services/articleService';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../models/article.schema';
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