import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../models/article.schema';
import { RatingArticleDto } from '../dto/ratingArticle.dto';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { UpdateStatusDto } from '../dto/updateStatus.dto';
import { Moderator } from '../models/moderator.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Moderator.name) private moderatorModel: Model<Moderator>,
  ) {}

  // Method for testing if the route is functioning
  test(): string {
    return 'Article route testing';
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(_id: string): Promise<Article> {
    const article = await this.articleModel.findById(_id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(createArticlesDto: CreateArticleDto): Promise<Article> {
    return this.articleModel.create(createArticlesDto);
  }

  async update(
    _id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Article> {
    const article = await this.articleModel
      .findByIdAndUpdate(_id, updateStatusDto, { new: true })
      .exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async delete(_id: string): Promise<Article | null> {
    const deletedArticle = await this.articleModel
      .findByIdAndDelete(_id)
      .exec();
    if (!deletedArticle) {
      throw new NotFoundException('Article not found');
    }
    return deletedArticle;
  }

  async approvingArticle(
    _id: string,
    moderatorId: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(
        _id,
        { $set: { status: updateStatusDto.status } },
        { new: true },
      )
      .exec();
  }

  async getApprovingRequestedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'Submitted' }).exec();
  }

  async getDisplayingRequestedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'Approved' }).exec();
  }

  async getRejectedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: { $in: ['Rejected'] } }).exec();
  }

  async ratingArticle(_id: string, ratingArticleDto: RatingArticleDto) {
    const article = await this.articleModel.findById(_id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.rating = ratingArticleDto.rating;

    return article.save();
  }

  async storeRejectedArticles(rejectedArticle: Article): Promise<Article> {
    return this.articleModel.create(rejectedArticle);
  }

  async storeApprovedArticles(approvedArticles: Article[]): Promise<void> {
    await Promise.all(
      approvedArticles.map((article) => this.articleModel.create(article)),
    );
  }

  async batchUpdateStatus(updates: UpdateStatusDto[]) {
    const updatePromises = updates.map((update) =>
      this.articleModel.updateOne(
        { _id: update._id },
        { status: update.status },
      ),
    );

    await Promise.all(updatePromises); // Wait for all updates to complete
    return { message: 'Batch update successful' }; // Return success message
  }
}
