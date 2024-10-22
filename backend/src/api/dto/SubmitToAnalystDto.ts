import { IsArray, ValidateNested } from 'class-validator'; // Import validation decorators
import { Type } from 'class-transformer'; // Import Type for transforming plain objects
import { Article } from '../models/Article.Schema'; // Adjust the path as necessary

export class SubmitToAnalystDto {
  @IsArray() // Validate that the articles property is an array
  @ValidateNested({ each: true }) // Validate each nested article object
  @Type(() => Article) // Transform plain objects to Article instances
  articles: Article[]; // Array of Article objects
}
