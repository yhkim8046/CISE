import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './articleService';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../models/article.schema';
import { Moderator } from '../models/moderator.schema';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { RatingArticleDto } from '../dto/ratingArticle.dto';

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
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const article = { title: 'Test Article' } as Article;
      jest.spyOn(articleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(article),
      } as any);

      expect(await service.findOne('someId')).toEqual(article);
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
  });

  describe('approvingArticle', () => {
    it('should approve an article if moderator exists and has correct role', async () => {
      const moderator = { typeOfUser: 'moderator' } as Moderator;
      const updatedArticle = { status: 'approved' } as Article;
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(moderator),
      } as any);
      jest.spyOn(articleModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedArticle),
      } as any);

      const result = await service.approvingArticle(
        'articleId',
        'moderatorId',
        { status: 'approved' },
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
        }),
      ).rejects.toThrow(ForbiddenException);
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
      expect(result.article.totalRating).toEqual(7);
      expect(result.article.ratingCounter).toEqual(2);
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
  });
});
