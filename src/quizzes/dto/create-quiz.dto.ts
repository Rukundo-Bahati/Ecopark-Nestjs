import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Quiz description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  createdById: string;
}
