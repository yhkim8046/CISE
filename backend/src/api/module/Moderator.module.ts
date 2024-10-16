// moderator.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModeratorController } from '../controllers/moderator.controller';
import { ModeratorService } from '../services/ModeratorService';
import { Moderator, ModeratorSchema } from '../models/moderator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Moderator.name, schema: ModeratorSchema }]),
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
  exports: [MongooseModule.forFeature([{ name: Moderator.name, schema: ModeratorSchema }])],
})
export class ModeratorModule {}
