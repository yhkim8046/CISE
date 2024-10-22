// moderator.service.ts
import { Injectable } from '@nestjs/common';
import { Moderator, ModeratorDocument } from '../models/Moderator.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ModeratorService {
  constructor(
    @InjectModel(Moderator.name)
    private moderatorModel: Model<ModeratorDocument>,
  ) {}

  async createModerator(typeOfUser: 'moderator' | 'SREC'): Promise<Moderator> {
    console.log('Creating Moderator with type:', typeOfUser);
    const newModerator = new this.moderatorModel({ typeOfUser });
    return newModerator.save();
  }

  async findOne(id: string): Promise<Moderator> {
    return await this.moderatorModel.findById(id).exec();
  }
}
