import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum UserMissionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
}

export class CreateUserMissionDto {
  @ApiProperty()
  @IsString()
  missionId: string;

  @ApiProperty({ enum: UserMissionStatus, required: false })
  @IsOptional()
  @IsEnum(UserMissionStatus)
  status?: UserMissionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proofUrl?: string;
}
