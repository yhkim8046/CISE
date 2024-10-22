// moderator.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModeratorController } from '../controllers/Moderator.Controller';
import { ModeratorService } from '../services/ModeratorService';
import { Moderator, ModeratorSchema } from '../models/Moderator.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Moderator.name, schema: ModeratorSchema },
    ]),
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
  exports: [
    MongooseModule.forFeature([
      { name: Moderator.name, schema: ModeratorSchema },
    ]),
  ],
})
export class ModeratorModule {}
