import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Authors are required' })
  author: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Year of publication is required' })
  yearOfPublication: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pages?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  volume?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid DOI format' })
  doi?: string;

  @IsString()
  @IsNotEmpty({ message: 'Claim is required' })
  claim: string;

  @IsString()
  @IsNotEmpty({ message: 'Type of research is required' })
  typeOfResearch: string; // updated for type of research

  @IsString()
  @IsNotEmpty({ message: 'Type of participant is required' })
  typeOfParticipant: string; // new field for type of participant
  
  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  reasonForRejection?: string; // new field for rejection reasons
}
