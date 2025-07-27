import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  UseGuards,
  Query,
  Put,
  Delete,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyAccountDto,
} from './dto/index';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CustomApiResponse, UserResponseDto } from 'src/@types/response';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered and JWT returned.',
  })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<
    CustomApiResponse<{ token: string; user: UserResponseDto } | null>
  > {
    this.logger.log(
      `User registration attempt: ${dto.email}`,
      'AuthController',
    );
    const result = await this.authService.register(dto);
    this.logger.log(
      `User registration ${result.success ? 'successful' : 'failed'}: ${dto.email}`,
      'AuthController',
    );
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT' })
  @ApiResponse({ status: 200, description: 'JWT returned.' })
  async login(@Body() dto: LoginDto, @Req() req) {
    this.logger.log(`User login attempt: ${dto.email}`, 'AuthController');
    const result = await this.authService.login(dto, req);
    this.logger.log(
      `User login ${result.success ? 'successful' : 'failed'}: ${dto.email}`,
      'AuthController',
    );
    return result;
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    this.logger.log(`Forgot password request: ${data.email}`, 'AuthController');
    const result = await this.authService.forgotPassword(data);
    this.logger.log(
      `Forgot password ${result.success ? 'email sent' : 'failed'}: ${data.email}`,
      'AuthController',
    );
    return result;
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: ResetPasswordDto) {
    this.logger.log(
      `Password reset attempt for token: ${data.token.substring(0, 10)}...`,
      'AuthController',
    );
    const result = await this.authService.resetPassword(data);
    this.logger.log(
      `Password reset ${result.success ? 'successful' : 'failed'}`,
      'AuthController',
    );
    return result;
  }

  @Get('resend-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification code' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  async resendCode(@Req() req) {
    const user = req['user'] as User;

    if (!user?.email) {
      throw new UnauthorizedException('User email is missing from token');
    }

    this.logger.log(
      `Resend verification code request: ${user.email}`,
      'AuthController',
    );
    const result = await this.authService.resendCode(user);
    this.logger.log(
      `Resend verification code ${result.success ? 'successful' : 'failed'}: ${user.email}`,
      'AuthController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @Post('verify-account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify account using JWT and code' })
  verifyAccount(@Body() data: VerifyAccountDto, @Req() req: Request) {
    return this.authService.verifyAccount(data, req['user'] as User);
  }

}
