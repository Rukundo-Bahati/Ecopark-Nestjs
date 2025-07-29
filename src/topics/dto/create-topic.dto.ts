// create-topic.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateTopicDto {

  @ApiProperty({ example: 'Climate Science Basics' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'thermometer' })
  @IsString()
  @IsOptional()
  icon: string;

  @ApiProperty({ example: '#ef4444' })
  @IsString()
  color: string;

  @ApiProperty({ example: 12, description: 'Number of lessons' })
  @IsInt()
  @Min(1)
  lessons: number;
}
