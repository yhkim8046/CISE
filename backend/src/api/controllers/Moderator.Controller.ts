// moderator.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { ModeratorService } from '../services/ModeratorService';
import { Moderator } from '../models/moderator.schema';
import { ArticleService } from '../services/articleService';

@Controller('api/moderators')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Post('/')
  async createModerator(@Body() body: { typeOfUser: 'moderator' | 'SREC' }): Promise<Moderator> {
    console.log('Received body:', body); 
    return this.moderatorService.createModerator(body.typeOfUser);
  }

}
