import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class RatingArticleDto {
  @IsOptional() // Make the rating field optional
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(0, { message: 'Rating cannot be less than 0.' })
  @Max(5, { message: 'Rating cannot be more than 5.' })
  rating?: number; // Optional field

  @IsOptional() // Make value optional if it doesn't always need to be present
  value?: number;

  @IsOptional() // Assuming these are optional too
  ratingCounter?: number; // Optional field

  @IsOptional() // Assuming these are optional too
  totalRating?: number; // Optional field

  @IsOptional() // Assuming these are optional too
  averageRating?: number; // Optional field
}
