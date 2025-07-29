import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizQuestionDto {

  @ApiProperty()
@IsString()
@IsNotEmpty()
quizId: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: { A: 'Option A', B: 'Option B' } })
  @IsObject()
  options: Record<string, string>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  correct: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explanation: string;
}
