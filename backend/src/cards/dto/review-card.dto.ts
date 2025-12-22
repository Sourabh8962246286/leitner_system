
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

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
}
