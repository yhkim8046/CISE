// moderator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ModeratorService } from '../services/moderatorService';
import { Moderator } from '../models/moderator.schema';

@Controller('api/moderators')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Post('/')
  async createModerator(
    @Body() body: { typeOfUser: 'moderator' | 'SREC' },
  ): Promise<Moderator> {
    console.log('Received body:', body);
    return this.moderatorService.createModerator(body.typeOfUser);
  }
}
