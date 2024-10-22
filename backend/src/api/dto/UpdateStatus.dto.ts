import { IsString, IsIn } from 'class-validator';

export class updateStatusDto {
  @IsString()
  _id: string; // Ensure we are using _id to match MongoDB

  @IsString()
  @IsIn(['Submitted', 'Approved', 'Rejected'])
  status: string;
}
