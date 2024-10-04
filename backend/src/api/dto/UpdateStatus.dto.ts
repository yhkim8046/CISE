import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(["submitted", "approved", "rejected", "displayable", "undisplayable"])
  status: string;  
}
