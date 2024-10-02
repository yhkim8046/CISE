export class CreateArticleDto {
  title: string;
  authors: string;
  source: string;    
  yearOfPublication: number;
  pages: number;   
  volumn: number;
  doi: string;       
  claim: string;
  evidence: string;
  submittedDate: Date;
  typeOfResearch: string;
  typeOfParticipant: string;
}
