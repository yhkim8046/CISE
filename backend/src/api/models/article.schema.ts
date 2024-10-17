import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  // Consider letting Mongoose handle the _id field automatically
  @Prop() // Remove custom id field unless necessary
  _id: string; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string[];

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

  @Prop() // Consider handling this in the service when an article is approved
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
  reasonForRejection?: string; // Make this optional for rejection reasons
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
