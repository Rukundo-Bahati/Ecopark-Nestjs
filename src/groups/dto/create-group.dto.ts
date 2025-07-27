import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Group description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
