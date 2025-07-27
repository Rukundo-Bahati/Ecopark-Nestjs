import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnvironmentalDataDto {
  @ApiProperty({ description: 'Data source (IPCC, NASA, Local, etc.)' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Type of data (temperature, air_quality, etc.)' })
  @IsString()
  @IsNotEmpty()
  dataType: string;

  @ApiProperty({ description: 'Geographic location reference' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Actual environmental data (JSON object)' })
  @IsObject()
  data: Record<string, any>;
}
