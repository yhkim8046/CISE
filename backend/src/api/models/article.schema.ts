import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  // Remove the custom _id field
  // _id: string; // MongoDB automatically generates this, so no need to declare it

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

  @Prop({
    type: String,
    enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status: string;

  @Prop({ required: true, default: Date.now })
  submittedDate: Date;

  @Prop()
  evidence: string;

  @Prop()
  approvedDate: Date;

  @Prop({ min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  ratingCounter: number;

  @Prop({ default: 0 })
  totalRating: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop()
  journalConferenceName: string;

  @Prop()
  claim: string;

  @Prop()
  isEvidencePositive: boolean;

  @Prop({ type: String, enum: ['Case Study', 'Experiment'] })
  typeOfResearch: string;

  @Prop({ type: String, enum: ['Student', 'Practitioner'] })
  typeOfParticipant: string;

  @Prop()
  link: string;

  @Prop()
  reasonForRejection?: string; // Optional field
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
