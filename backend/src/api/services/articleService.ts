import { Injectable } from "@nestjs/common";
import { Article } from "../models/article.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "../dto/createArticle.dto";

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>) {}

  test(): string {
    return 'Article route testing';
  }

  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    return await this.articleModel.findById(id).exec();
  }

  async create(createArticlesDto: CreateArticleDto) {
    return await this.articleModel.create(createArticlesDto);
  }

  async update(id: string, createArticlesDto: CreateArticleDto) {
    return await this.articleModel.findByIdAndUpdate(id, createArticlesDto, { new: true }).exec();
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }
}
