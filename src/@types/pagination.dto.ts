import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convert incoming value to a number
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convert incoming value to a number
  limit?: number = 10;
}
