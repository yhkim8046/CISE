import { IsInt, Min, Max } from 'class-validator';

export class RatingArticleDto {
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(0, { message: 'Rating cannot be less than 0.' })
  @Max(5, { message: 'Rating cannot be more than 5.' })
  rating: number;
  value: number;
  
  ratingCounter: number;
  totalRating: number;
  averageRating: number;
}
