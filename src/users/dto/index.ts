import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}

export class ChangeProfilePhotoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public profilePhoto: string;
}