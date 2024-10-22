import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Patch,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from '../services/ArticleService';
import { CreateArticleDto } from '../dto/CreateArticle.dto';
import { UpdateStatusDto } from '../dto/UpdateStatus.dto';
import { SubmitToAnalystDto } from '../dto/SubmitToAnalystDto';
import { Article } from '../models/Article.schema';
import { RatingArticleDto } from '../dto/RatingArticle.dto';

@Controller('api/articles')
export class ArticleController {
  articleModel: any;
  constructor(private readonly articleService: ArticleService) {}

  @Get('/test')
  test() {
    return this.articleService.test();
  }

  // Get all articles
  @Get('/')
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  // Get one article via _id
  @Get('/:_id')
  async findOne(@Param('_id') _id: string): Promise<Article> {
    const article = await this.articleService.findOne(_id);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  // Create/add an article
  @Post('/')
  async addArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<{ message: string }> {
    console.log('Received article data:', createArticleDto); // Log the received data
    try {
      await this.articleService.create(createArticleDto);
      return { message: 'Article added successfully' };
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this article',
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Update an article
  @Put('/:_id')
  async updateArticle(
    @Param('_id') _id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ message: string }> {
    const updatedArticle = await this.articleService.update(
      _id,
      updateStatusDto,
    );
    if (!updatedArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Article updated successfully' };
  }

  // Delete Article
  @Delete('/:_id')
  async deleteArticle(@Param('_id') _id: string): Promise<{ message: string }> {
    const deletedArticle = await this.articleService.delete(_id);
    if (!deletedArticle) {
      throw new HttpException('No such article', HttpStatus.NOT_FOUND);
    }
    return { message: 'Article deleted successfully' };
  }

  // Approving Article by Moderator/SREC
  @Put('/approving/:_id')
  async approvingArticle(
    @Param('_id') _id: string,
    @Query('moderatorId') moderatorId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ message: string }> {
    const updatedArticle = await this.articleService.approvingArticle(
      _id,
      moderatorId,
      updateStatusDto,
    );
    if (!updatedArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Article approved successfully' };
  }

  // Get submitted articles
  @Get('/submittedArticles')
  async getSubmittedArticles(): Promise<Article[]> {
    return this.articleService.getApprovingRequestedArticles();
  }

  // Get rejected articles
  @Get('/rejected')
  async getRejectedArticles(): Promise<Article[]> {
    return this.articleService.getRejectedArticles();
  }

  // Submit rejected articles
  @Post('/rejected')
  async submitRejectedArticles(
    @Body() rejectedArticles: Article[],
  ): Promise<{ message: string; results: Article[] }> {
    const results = await Promise.all(
      rejectedArticles.map((article) => {
        return this.articleService.storeRejectedArticles(article);
      }),
    );

    return {
      message: 'Rejected articles submitted successfully',
      results,
    };
  }

  // Get approved articles
  @Get('/approved')
  async getApprovedArticles(): Promise<Article[]> {
    return this.articleService.getDisplayingRequestedArticles();
  }

  // Submit articles to analyst
  @Post('/submitToAnalyst')
  async submitToAnalyst(
    @Body() submitToAnalystDto: SubmitToAnalystDto,
  ): Promise<{ message: string; rejected: Article[] }> {
    const articles = submitToAnalystDto.articles;

    // Separate approved and rejected articles
    const approvedArticles = articles.filter(
      (article) => article.status === 'Approved',
    );
    const rejectedArticles = articles.filter(
      (article) => article.status === 'Rejected',
    );

    try {
      // Store rejected articles in the database with a reason
      const rejectedResults = await Promise.all(
        rejectedArticles.map(async (article) => {
          const reason = article.reasonForRejection || 'No reason provided';
          return this.articleService.storeRejectedArticles({
            reasonForRejection: reason,
            ...article,
          });
        }),
      );

      // Store approved articles for display
      await this.articleService.storeApprovedArticles(approvedArticles);

      return {
        message: 'Articles processed successfully',
        rejected: rejectedResults,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to submit articles',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Batch update articles
  @Patch('/batch-update')
  async batchUpdateStatus(
    @Body() updates: UpdateStatusDto[],
  ): Promise<{ message: string }> {
    console.log('Batch update requested with:', updates); // Debug log
    await this.articleService.batchUpdateStatus(updates); // Ensure service handles the update logic
    return { message: 'Batch update successful' };
  }

  @Post('/submitReviewed')
  async submitReviewed(
    @Body() body: { articles: { _id: string; evidence: string }[] },
  ): Promise<{ message: string }> {
    try {
      // Pass the articles data to the service layer
      await this.articleService.submitReviewedArticles(body.articles);
      return { message: 'Articles successfully submitted and updated' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to submit reviewed articles',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/rate')
    async updateRating(@Param('id') id: string, @Body() ratingArticleDto: RatingArticleDto) {
        const { rating } = ratingArticleDto; // Corrected to use ratingArticleDto

        // Validate the rating value (ensure it's between 1 and 5)
        if (rating === undefined || rating < 1 || rating > 5) {
            throw new BadRequestException('Rating must be an integer between 1 and 5');
        }

        // Call the service to update the article rating
        return this.articleService.ratingArticle(id, ratingArticleDto);
    }
}