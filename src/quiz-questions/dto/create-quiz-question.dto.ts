import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizQuestionDto {
  @ApiProperty({ description: 'Quiz ID' })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({ description: 'Available answer options (JSON object)' })
  @IsObject()
  options: Record<string, any>;

  @ApiProperty({ description: 'Correct answer identifier' })
  @IsString()
  @IsNotEmpty()
  correctOption: string;
}
