import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;  

  @Prop()
  yearOfPublication: number;

  @Prop()
  pages: number;

  @Prop()
  volume: number; 

  @Prop()
  doi: string;

  @Prop()
  approvedSe: boolean;

  @Prop({ required: true })
  submittedDate: Date;
  
  @Prop({ required: true })
  approvedDate: Date;

  @Prop({ min: 1, max: 5 })
  rating: number;

  @Prop()
  journelConferenceName: string;

  @Prop()
  claim: string;

  @Prop()
  isEvidencePositive: boolean;

  @Prop({ type: String, enum: ['Case Study', 'Experiment'] })
  typeOfResearch: string;

  @Prop({ type: String, enum: ['Student', 'Practitioner'] })
  typeOfParticipant: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
