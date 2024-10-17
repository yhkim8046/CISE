import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document; // Extend Document

@Schema()
export class Article {
  @Prop({ type: String }) // Explicitly define id
  _id: string; // Custom type; normally, this is ObjectId unless specified otherwise.

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
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted',
  })
  status: string;

  @Prop({ required: true, default: Date.now })
  submittedDate: Date;

  @Prop()
  evidence: string;
  
  @Prop({default: Date.now})
  approvedDate: Date;

  @Prop({ min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 }) // Default to 0 to prevent undefined behavior
  ratingCounter: number;

  @Prop({ default: 0 }) // Default to 0 for clarity
  totalRating: number;

  @Prop({ default: 0 }) // Default to 0 for clarity
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
