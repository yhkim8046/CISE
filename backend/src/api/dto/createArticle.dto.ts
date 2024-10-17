import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Authors are required' })
  authors: string;

  @IsString()
  @IsNotEmpty({ message: 'Source is required' })
  source: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Year of publication is required' })
  yearOfPublication: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pages: number; 

  @IsNumber()
  @IsPositive()
  @IsOptional()
  volume: number;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'DOI must be a valid URL' })
  doi: string;

  @IsString()
  @IsNotEmpty({ message: 'Claim is required' })
  claim: string;

  @IsString()
  @IsNotEmpty({ message: 'Evidence is required' })
  evidence: string;

  @IsString()
  @IsOptional()
  typeOfResearch: string;

  @IsString() 
  @IsOptional()
  typeOfParticipant: string;
  
  @IsString()
  @IsOptional()
  link: string;
}
