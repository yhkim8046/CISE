import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Article } from "../models/article.schema";
import { RatingArticleDto } from "../dto/ratingArticle.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateArticleDto } from "../dto/createArticle.dto";
import { UpdateStatusDto } from "../dto/UpdateStatus.dto";
import { Moderator } from "../models/moderator.schema";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(Moderator.name) private moderatorModel: Model<Moderator>,
  ) {}

  // Method for testing if the route is functioning
  test(): string {
    return 'Article route testing';
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(createArticlesDto: CreateArticleDto): Promise<Article> {
    // Here, you might consider transforming the DTO if needed
    return this.articleModel.create(createArticlesDto);
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Article> {
    const article = await this.articleModel
      .findByIdAndUpdate(id, updateStatusDto, { new: true })
      .exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async delete(id: string): Promise<Article | null> {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    if (!deletedArticle) {
      throw new NotFoundException('Article not found');
    }
    return deletedArticle;
  }

  async approvingArticle(
    articleId: string,
    moderatorId: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Article> {
    const moderator = await this.moderatorModel.findById(moderatorId).exec();

    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    // Using enum for user roles might be a better practice
    if (moderator.typeOfUser !== 'moderator') {
      throw new ForbiddenException('Only moderators can approve articles');
    }

    return this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $set: { status: updateStatusDto.status } },
        { new: true },
      )
      .exec();
  }

  async getApprovingRequestedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'submitted' }).exec();
  }

  async getDisplayingRequestedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'approved' }).exec();
  }

  async getRejectedArticles(): Promise<Article[]> {
    return this.articleModel
      .find({ status: { $in: ['rejected', 'undisplayable'] } })
      .exec();
  }

  async ratingArticle(id: string, ratingArticleDto: RatingArticleDto) {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Update ratings and recalculate average
    article.totalRating += ratingArticleDto.rating;
    article.ratingCounter += 1;
    article.averageRating = article.totalRating / article.ratingCounter;

    await article.save();
    return { article, averageRating: article.averageRating };
  }

  async findArticlesByYearRange(
    startYear: number,
    endYear: number,
  ): Promise<Article[]> {
    return this.articleModel
      .find({
        yearOfPublication: { $gte: startYear, $lte: endYear },
      })
      .exec();
  }

  async submitReviewedArticles(
    articles: { id: string; status: string; reasonForRejection?: string }[],
  ): Promise<void> {
    // Consider using bulk operations if applicable
    for (const article of articles) {
      const { id, status, reasonForRejection } = article;
      await this.articleModel
        .findByIdAndUpdate(id, {
          status,
          ...(reasonForRejection && { reasonForRejection }),
        })
        .exec();
    }
  }

  async storeRejectedArticles(article: Article): Promise<Article> {
    return this.articleModel.create(article);
  }

  async storeApprovedArticles(articles: Article[]): Promise<Article[]> {
    return this.articleModel.insertMany(articles);
  }
}
