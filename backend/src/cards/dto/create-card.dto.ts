
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new card.
 */
export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  front: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  back: string;

  @IsMongoId()
  @IsNotEmpty()
  subjectId: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  color?: string;
}
