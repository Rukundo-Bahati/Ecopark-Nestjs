import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserMissionStatus } from './create-user-mission.dto';

export class UpdateUserMissionDto {
  @ApiProperty({ enum: UserMissionStatus, required: false })
  @IsOptional()
  @IsEnum(UserMissionStatus)
  status?: UserMissionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proofUrl?: string;
}
