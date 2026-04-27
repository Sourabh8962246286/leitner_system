import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateCardLogDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  timeSpent: number;
}
