import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateQuizQuestionDto } from 'src/quiz-questions/dto/create-quiz-question.dto';
// Nested question DTO without quizId
export class CreateNestedQuizQuestionDto {
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

// CreateQuizDto uses the nested DTO for questions
export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Quiz description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Quiz Questions',
    type: [CreateNestedQuizQuestionDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateNestedQuizQuestionDto)
  questions?: CreateNestedQuizQuestionDto[];
}
