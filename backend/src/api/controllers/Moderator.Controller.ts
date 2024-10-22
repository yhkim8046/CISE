// moderator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ModeratorService } from '../services/ModeratorService';
import { Moderator } from '../models/Moderator.Schema';

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
