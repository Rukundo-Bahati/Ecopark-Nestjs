// src/common/dto/pagination-query.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
    @ApiPropertyOptional({
      description: 'Page number (starts from 1)',
      default: 1,
      minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;
  
    @ApiPropertyOptional({
      description: 'Number of items per page',
      default: 10,
      minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    items?: number = 10;
  }