import { Injectable } from "@nestjs/common";
import { Article } from "../models/article.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "../dto/createArticle.dto";
import { UpdateStatusDto } from "../dto/UpdateStatus.dto";
import { RatingArticleDto } from "../dto/ratingArticle.dto";

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

  //it can be used for the moderator and SREC
  async approvingArticle(id: string, updateStatusDto: UpdateStatusDto){
    return await this.articleModel.findByIdAndUpdate(
      id,
      { $set: { status: updateStatusDto.status }}, 
      { new: true }
    ).exec();
  } 
  
  //Finding articles need to be pass to SREC by the moderator
  async getApprovingRequestedArticles() {
    return await this.articleModel.find({ status: "submitted" }).exec();
  }
  
  //Finding articles requested to be displaying
  async getDisplayingRequestedArticles(){
    return await this.articleModel.find({status:"approved"}).exec();
  }

  //get Rejected Articles
  async getRejectedArticles(){
    return await this.articleModel.find({ status: { $in: ["rejected", "undisplayable"] }}).exec();
  }  

  // Record Rating and Returning Average Rating
  async ratingArticle(id: string, ratingArticleDto: RatingArticleDto){
    const article = await this.articleModel.findById(id).exec();
    
    if (!article) {
      throw new Error("Article not found");
    }

    article.totalRating += ratingArticleDto.rating;
    article.ratingCounter += 1;

    article.averageRating = article.totalRating / article.ratingCounter;

    await article.save();

    return { article, averageRating: article.averageRating };
  }
}
