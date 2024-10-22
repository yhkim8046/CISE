import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './ArticleService';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../models/Article.schema';
import { Moderator } from '../models/Moderator.schema';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateArticleDto } from '../dto/CreateArticle.dto';
import { RatingArticleDto } from '../dto/RatingArticle.dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleModel: Model<Article>;
  let moderatorModel: Model<Moderator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken(Moderator.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleModel = module.get<Model<Article>>(getModelToken(Article.name));
    moderatorModel = module.get<Model<Moderator>>(
      getModelToken(Moderator.name),
    );
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const articles = [{ title: 'Test Article' }] as Article[];
      jest.spyOn(articleModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(articles),
      } as any);

      expect(await service.findAll()).toEqual(articles);
    });

    it('should throw an error if find fails', async () => {
      jest.spyOn(articleModel, 'find').mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error('Database error')),
      } as any);

      await expect(service.findAll()).rejects.toThrow('Database error');
    });

    it('should throw BadRequestException if invalid query is provided', async () => {
      jest.spyOn(articleModel, 'find').mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new BadRequestException('Invalid query')),
      } as any);

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const article = { title: 'Test Article' } as Article;
      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(article),
      } as any);

      expect(await service.findOne('someId')).toEqual(article);
    });

    it('should throw NotFoundException if article is not found', async () => {
      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if invalid ID format is provided', async () => {
      await expect(service.findOne('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
      } as CreateArticleDto;
      jest
        .spyOn(articleModel, 'create')
        .mockResolvedValueOnce(createArticleDto as any);

      expect(await service.create(createArticleDto)).toEqual(createArticleDto);
    });

    it('should throw an error if creation fails', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
      } as CreateArticleDto;

      jest
        .spyOn(articleModel, 'create')
        .mockRejectedValueOnce(new Error('Creation failed'));

      await expect(service.create(createArticleDto)).rejects.toThrow(
        'Creation failed',
      );
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const createArticleDto: CreateArticleDto = {
        title: '', // Title is missing
      } as CreateArticleDto;

      await expect(service.create(createArticleDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('approvingArticle', () => {
    it('should approve an article if moderator exists and has correct role', async () => {
      const moderator = { typeOfUser: 'moderator' } as Moderator;
      const updatedArticle = { status: 'approved' } as unknown as Article;
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(moderator),
      } as any);
      jest.spyOn(articleModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedArticle),
      } as any);

      const result = await service.approvingArticle(
        'articleId',
        'moderatorId',
        {
          status: 'approved',
          _id: ''
        },
      );
      expect(result).toEqual(updatedArticle);
    });

    it('should throw NotFoundException if moderator does not exist', async () => {
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.approvingArticle('articleId', 'moderatorId', {
          status: 'approved',
          _id: ''
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not a moderator', async () => {
      const nonModerator = { typeOfUser: 'user' } as Moderator;
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(nonModerator),
      } as any);

      await expect(
        service.approvingArticle('articleId', 'moderatorId', {
          status: 'approved',
          _id: ''
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if approval status is invalid', async () => {
      const moderator = { typeOfUser: 'moderator' } as Moderator;
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(moderator),
      } as any);

      await expect(
        service.approvingArticle('articleId', 'moderatorId', {
          status: 'invalidStatus',
          _id: ''
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('ratingArticle', () => {
    it('should return the updated article with average rating', async () => {
      const article = {
        totalRating: 3,
        ratingCounter: 1,
        save: jest.fn().mockResolvedValue(true),
      } as any;
      const ratingDto: RatingArticleDto = {
        rating: 4,
        ratingCounter: 0,
        totalRating: 0,
        averageRating: 0,
      };

      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(article),
      } as any);

      const result = await service.ratingArticle('articleId', ratingDto);
      expect(result.totalRating).toEqual(7);
      expect(result.ratingCounter).toEqual(2);
      expect(result.averageRating).toEqual(3.5);
    });

    it('should throw an error if article is not found', async () => {
      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const ratingDto: RatingArticleDto = {
        rating: 4,
        ratingCounter: 0,
        totalRating: 0,
        averageRating: 0,
      };

      await expect(
        service.ratingArticle('invalidId', ratingDto),
      ).rejects.toThrow('Article not found');
    });

    it('should throw BadRequestException if rating exceeds maximum allowed value', async () => {
      const article = {
        totalRating: 3,
        ratingCounter: 1,
        save: jest.fn().mockResolvedValue(true),
      } as any;
      const invalidRatingDto: RatingArticleDto = {
        rating: 7, // Invalid rating, exceeds max value of 5
        ratingCounter: 0,
        totalRating: 0,
        averageRating: 0,
      };

      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(article),
      } as any);

      await expect(
        service.ratingArticle('articleId', invalidRatingDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if saving the updated article fails', async () => {
      const article = {
        totalRating: 3,
        ratingCounter: 1,
        save: jest.fn().mockRejectedValueOnce(new Error('Save failed')),
      } as any;
      const ratingDto: RatingArticleDto = {
        rating: 4,
        ratingCounter: 0,
        totalRating: 0,
        averageRating: 0,
      };

      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(article),
      } as any);

      await expect(
        service.ratingArticle('articleId', ratingDto),
      ).rejects.toThrow('Save failed');
    });
  });
});