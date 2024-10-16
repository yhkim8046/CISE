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

  @Prop({ unique: true })
  doi: string;

  @Prop({type: String, enum: ["submitted","approved","rejected","displayable","undisplayable"], default: "submitted"})
  status: string;

  @Prop({ required: true, default: Date.now })
  submittedDate: Date;
  
  @Prop()
  approvedDate: Date;

  @Prop({ min: 0, max: 5 })
  rating: number;

  @Prop()
  ratingCounter: number;

  @Prop()
  totalRating: number;

  @Prop()
  averageRating: number;

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
