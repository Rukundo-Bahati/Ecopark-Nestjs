import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserQuizAttemptDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Quiz ID' })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: 'Score earned from attempt' })
  @IsInt()
  score: number;

  @ApiProperty({ description: 'Stars earned from attempt' })
  @IsInt()
  stars: number;
}
