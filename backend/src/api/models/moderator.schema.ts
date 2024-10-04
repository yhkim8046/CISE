import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModeratorDocument = HydratedDocument<Moderator>;

@Schema()
export class Moderator {
    
    @Prop({require:true})
    email: string;

    @Prop({required:true})
    password: string;

    @Prop({ type: String, enum: ['moderator', 'SREC'],required:true})
    typeOfUser: string;
    
}

export const ArticleSchema = SchemaFactory.createForClass(Moderator);
