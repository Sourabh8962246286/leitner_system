
import { IsArray, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for updating a card.
 * All fields are optional.
 */
export class UpdateCardDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  front?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  back?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  color?: string;
}
