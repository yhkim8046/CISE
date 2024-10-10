// moderator.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModeratorDocument = HydratedDocument<Moderator>;

@Schema()
export class Moderator {
  @Prop({ type: String, enum: ['moderator', 'SREC'], required: true })
  typeOfUser: string;
}

export const ModeratorSchema = SchemaFactory.createForClass(Moderator);
