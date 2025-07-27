import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty({ description: 'Group ID' })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({ description: 'Challenge title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Challenge description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Start date (ISO string)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (ISO string)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  createdById: string;
}
