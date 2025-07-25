import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsStrongPassword, IsIn } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
} 

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minUppercase: 1,
  }, { message: "Password must be at least 8 characters long, contains at least 1 symbol and contain at least 1 uppercase letter." })
  @ApiProperty()
  @MinLength(6)
  password: string;

  @IsString()
  @ApiProperty()
  public confirmPassword: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsIn(['SUPER-ADMIN', 'ADMIN', 'USER'])
  public userRole?: string

  @ApiProperty()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
} 

export class UpdateAuthDto extends PartialType(RegisterDto) {}

export class ChangeProfilePhotoDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public profilePhoto: string
  }

export class VerifyAccountDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
  }
  export class ForgotPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;
  }
  
  export class WithTokenDto {
    @ApiProperty()
    @IsString()
    token: string;
  }

  export class ResetPasswordDto extends WithTokenDto {
    @IsStrongPassword({ minLength: 8, minSymbols: 0, minLowercase: 0 })
    @ApiProperty()
    public password: string;
  
    @IsStrongPassword({ minLength: 8, minSymbols: 0, minLowercase: 0 })
    @ApiProperty()
    public confirmPassword: string;
  }