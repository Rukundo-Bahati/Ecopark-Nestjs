import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ description: 'Reward name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Reward description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Reward category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Points required to redeem' })
  @IsInt()
  pointsRequired: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  available: boolean

  @ApiProperty({ description: 'URL to reward image' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
