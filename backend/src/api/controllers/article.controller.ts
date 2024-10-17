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
  Query,
} from '@nestjs/common';
import { ArticleService } from '../services/ArticleService';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { UpdateStatusDto } from '../dto/UpdateStatus.dto';
import { Article } from '../models/article.schema';

@Controller('api/articles')
export class ArticleController {
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

  // Get one article via id
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Article> {
    const article = await this.articleService.findOne(id);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  // Create/add an article
  @Post('/')
  async addArticle(@Body() createArticleDto: CreateArticleDto) {
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
  @Put('/:id')
  async updateArticle(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const updatedArticle = await this.articleService.update(
      id,
      updateStatusDto,
    );
    if (!updatedArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Article updated successfully' };
  }

  // Delete Article
  @Delete('/:id')
  async deleteArticle(@Param('id') id: string) {
    const deletedArticle = await this.articleService.delete(id);
    if (!deletedArticle) {
      throw new HttpException('No such article', HttpStatus.NOT_FOUND);
    }
    return { message: 'Article deleted successfully' };
  }

  // Approving Article by Moderator/SREC
  @Put('/approving/:id')
  async approvingArticle(
    @Param('id') id: string,
    @Query('moderatorId') moderatorId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const updatedArticle = await this.articleService.approvingArticle(
      id,
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

  // Get approved articles
  @Get('/approved')
  async getApprovedArticles(): Promise<Article[]> {
    return this.articleService.getDisplayingRequestedArticles();
  }

  // New endpoint to submit approved articles to analyst
  @Post('/submitToAnalyst')
  async submitToAnalyst(@Body() articles: Article[]) {
    const approvedArticles = articles.filter(
      (article) => article.status === 'Approved',
    );
    const rejectedArticles = articles.filter(
      (article) => article.status === 'Rejected',
    );

    try {
      await this.articleService.storeApprovedArticles(approvedArticles);
      await this.articleService.storeRejectedArticles(rejectedArticles);
      return { message: 'Articles submitted successfully' };
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
}
