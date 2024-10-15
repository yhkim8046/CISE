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
import { ArticleService } from '../services/articleService';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { UpdateStatusDto } from '../dto/UpdateStatus.dto';
import { error } from 'console';

@Controller('api/articles')
export class ArticleController{
  constructor(private readonly articleService: ArticleService){}

  @Get('/test')
  test() {
    return this.articleService.test();
  }

  // Get all articles
  @Get('/')
  async findAll() {
    try {
      return this.articleService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

   // Get one book via id
   @Get('/:id')
   async findOne(@Param('id') id: string) {
     try {
       return this.articleService.findOne(id);
     } catch {
       throw new HttpException(
         {
           status: HttpStatus.NOT_FOUND,
           error: 'No Articles found',
         },
         HttpStatus.NOT_FOUND,
         { cause: error },
       );
     }
   }
   // Create/add an article
  @Post('/')
  async addArticle(@Body() createArticleDto: CreateArticleDto) {
  try {
    await this.articleService.create(createArticleDto);
    return { message: 'Article added successfully' };
  } catch (err) {
    // error log
    console.error('Error occurred while adding article:', err);

    // Message delivering 
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Unable to add this article',
        message: err.message,  
        stack: err.stack,      
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

 
   // Update a article
   @Put('/:id')
   async updateArticle(
     @Param('id') id: string,
     @Body() createArticleDto: CreateArticleDto,
   ) {
     try {
       await this.articleService.update(id, createArticleDto);
       return { message: 'Article updated successfully' };
     } catch {
       throw new HttpException(
         {
           status: HttpStatus.BAD_REQUEST,
           error: 'Unable to update this Article',
         },
         HttpStatus.BAD_REQUEST,
         { cause: error },
       );
     }
   }
 
   //delete Article
   async deleteArticle(@Param('id') id: string) {
    try {
      return await this.articleService.delete(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such an Article',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Approving Article by Moderator/SREC
  @Put('/approving/:id')
  async approvingArticle(
    @Param('id') id: string,
    @Query('moderatorId') moderatorId: string, 
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    try {
      await this.articleService.approvingArticle(id, moderatorId, updateStatusDto);
      return { message: 'Article updated successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to update this Article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('/submittedArticles')
  async getSubmittedArciles(){
    try{
      return this.articleService.getApprovingRequestedArticles();
    }catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get('/rejected')
  async getRejectedArcticles(){
    try{
      return this.articleService.getRejectedArticles();
    }catch{
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get('/approved')
  async getApprovedArcticles(){
    try{
      return this.articleService.getDisplayingRequestedArticles();
    }catch{
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "No articles found",
        },
        HttpStatus.NOT_FOUND,
        {cause: error},
      );
    }
  }

  @Get('/passedArticles')
  async displayingArticles(){
    try{
      return this.articleService.getDisplayableArticles();
    }catch{
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "No articles Found",
      },
      HttpStatus.NOT_FOUND,
      {cause:error},
    );
    }
  }

  // Get articles within a specific year range
  @Get('/year-range')
  async findArticlesByYearRange(
    @Query('startYear') startYear: string,
    @Query('endYear') endYear: string,
  ) {
    // Validate startYear and endYear to ensure they are numbers and within a reasonable range
    const start = parseInt(startYear, 10);
    const end = parseInt(endYear, 10);

    if (isNaN(start) || isNaN(end) || start > end || start < 1900 || end > new Date().getFullYear()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid year range. Ensure both startYear and endYear are valid numbers, with startYear <= endYear, and within a valid range.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.articleService.findArticlesByYearRange(start, end);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error retrieving articles within the specified year range',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
} 