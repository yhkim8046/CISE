import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorService } from './ModeratorService';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Moderator, ModeratorDocument } from '../models/moderator.schema';

describe('ModeratorService', () => {
  let service: ModeratorService;
  let moderatorModel: Model<ModeratorDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModeratorService,
        {
          provide: getModelToken(Moderator.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ModeratorService>(ModeratorService);
    moderatorModel = module.get<Model<ModeratorDocument>>(getModelToken(Moderator.name));
  });

  describe('createModerator', () => {
    it('should create and return a new moderator', async () => {
      const moderatorData = { typeOfUser: 'moderator' };
      const createdModerator = { _id: 'someId', ...moderatorData } as Moderator;
      jest.spyOn(moderatorModel.prototype, 'save').mockResolvedValue(createdModerator);

      const result = await service.createModerator('moderator');
      expect(result).toEqual(createdModerator);
    });
  });

  describe('findOne', () => {
    it('should return a moderator by ID', async () => {
      const moderator = { _id: 'someId', typeOfUser: 'moderator' } as Moderator;
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(moderator),
      } as any);

      const result = await service.findOne('someId');
      expect(result).toEqual(moderator);
    });

    it('should return null if no moderator is found', async () => {
      jest.spyOn(moderatorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findOne('nonExistentId');
      expect(result).toBeNull();
    });
  });
});
