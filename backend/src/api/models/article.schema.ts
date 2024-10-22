import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define your enums here
export enum ArticleStatus {
  Pending = 'Pending',
  Submitted = 'Submitted',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum ResearchType {
  CaseStudy = 'Case Study',
  Experiment = 'Experiment',
}

export enum ParticipantType {
  Student = 'Student',
  Practitioner = 'Practitioner',
}

export type ArticleDocument = Article & Document;

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

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus), // Use enum values
    default: ArticleStatus.Pending, // Default to Pending
  })
  status: ArticleStatus; // Use enum type for status

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

  @Prop({
    type: String,
    enum: Object.values(ResearchType), // Use enum values for research type
  })
  typeOfResearch: ResearchType; // Use enum type for research type

  @Prop({
    type: String,
    enum: Object.values(ParticipantType), // Use enum values for participant type
  })
  typeOfParticipant: ParticipantType; // Use enum type for participant type

  @Prop()
  link: string;

  @Prop()
  reasonForRejection?: string; // Optional rejection reason
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
