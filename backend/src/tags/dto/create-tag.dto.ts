
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  subjectId: string;
}
