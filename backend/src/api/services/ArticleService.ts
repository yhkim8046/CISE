import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../models/Article.Schema';
import { RatingArticleDto } from '../dto/RatingArticle.Dto';
import { CreateArticleDto } from '../dto/CreateArticle.Dto';
import { UpdateStatusDto } from '../dto/UpdateStatus.Dto';
import { Moderator } from '../models/Moderator.Schema';

@Injectable()
export class ArticleService {
  async submitReviewedArticles(
    articles: { _id: string; evidence: string }[],
  ): Promise<void> {
    // Loop over each article and update it with the provided evidence
    for (const article of articles) {
      await this.articleModel
        .findByIdAndUpdate(
          article._id, // Find the article by its ID
          {
            $set: {
              evidence: article.evidence, // Set the evidence field with the new value
              status: 'Submitted', // Optionally update the status to 'Reviewed' or another appropriate status
            },
          },
          { new: true }, // Return the updated article
        )
        .exec(); // Execute the query
    }
  }

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

    const { rating } = ratingArticleDto;

    // Validate the rating value (ensure it's an integer and between 1 and 5)
    if (rating === undefined || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    // Initialize ratingCounter and totalRating if they don't exist
    article.ratingCounter = article.ratingCounter || 0;
    article.totalRating = article.totalRating || 0;

    // Update rating values
    article.ratingCounter += 1; // Increment rating count
    article.totalRating += rating; // Update total rating
    article.averageRating = article.totalRating / article.ratingCounter; // Calculate new average rating

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

