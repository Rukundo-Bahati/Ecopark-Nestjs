import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupMemberDto {
  @ApiProperty({ description: 'Group ID' })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: "Member's role (member, admin)" })
  @IsString()
  @IsNotEmpty()
  role: string;
}
