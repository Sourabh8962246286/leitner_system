import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for a card review request.
 * Ensures the request body has the required properties with the correct types.
 */
export class ReviewCardDto {
  @IsNotEmpty()
  @IsMongoId()
  cardId: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;

  @IsOptional()
  @IsNumber()
  timeSpent?: number; // in seconds from manual timer, 0 if timer wasn't used
}
