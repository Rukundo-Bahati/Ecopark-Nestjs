import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role, User } from '@prisma/client';
import { CustomApiResponse, UserResponseDto } from 'src/@types/response';
import { MailingService } from 'src/mailing/mailing.service';
import env from 'src/utils/env';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyAccountDto,
} from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
  ) {}

  async login(
    loginDto: LoginDto,
    req: Request,
  ): Promise<
    CustomApiResponse<{ token: string; user: UserResponseDto } | null>
  > {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) throw new NotFoundException('Invalid credentials');

      if (!user.isVerified) {
        throw new NotAcceptableException('This account is not verified');
      }

      if (!user.isVerified) {
        await this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
          to: user.email,
          subject: 'Verify your account to continue',
          values: {
            name: user.email.split('@')[0],
            code: user.verificationCode ?? '',
          },
        });

        return new CustomApiResponse(
          false,
          'This account is not verified',
          null,
          null,
        );
      }

      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );

      if (!passwordMatch)
        throw new NotAcceptableException('Invalid credentials');

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return new CustomApiResponse(true, 'Login successful', {
        token,
        user: plainToInstance(UserResponseDto, user),
      });
    } catch (error) {
      console.log(error);
      return new CustomApiResponse(
        false,
        error.message ?? 'Login failed',
        null,
        error,
      );
    }
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<
    CustomApiResponse<{ token: string; user: UserResponseDto } | null>
  > {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) throw new NotAcceptableException('Email taken');

      if (registerDto.password !== registerDto.confirmPassword)
        throw new NotAcceptableException('Passwords do not match');

      const { confirmPassword, ...safeUser } = registerDto;

      const user = await this.prisma.user.create({
        data: {
          email: safeUser.email.trim(),
          passwordHash: await bcrypt.hash(safeUser.password, 10),
          displayName: safeUser.displayName,
          verificationCode: this.generateVerificationCode(),
          role: (safeUser.userRole as Role) || Role.USER,
          profilePhoto: safeUser.profilePhoto,
        },
      });


      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role
      }, { expiresIn: '7d' });


      await this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
        to: user.email,
        subject: 'Account Created',
        values: {
          name: user.email.split('@')[0],
          code: user.verificationCode ?? '',
        },
      });

      return new CustomApiResponse(true, 'Signup successful', {
        user: plainToInstance(UserResponseDto, user),
        token,
      });
    } catch (error) {
      console.log(error);
      return new CustomApiResponse(
        false,
        error.message ?? 'Registration failed',
        null,
        error,
      );
    }
  }

  async resendCode(user: User): Promise<CustomApiResponse<null>> {
    try {
      const theUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!theUser) {
        throw new NotFoundException('User not found');
      }

      if (theUser.isVerified) {
        throw new BadRequestException('Account is already verified');
      }

      const newCode = this.generateVerificationCode();

      await this.prisma.user.update({
        where: { id: theUser.id },
        data: { verificationCode: newCode },
      });

      await this.mailingService.sendMail('RESEND_VERIFICATION_CODE', {
        to: user.email,
        subject: `Your verification code is ${newCode}`,
        values: {
          name: user.email.split('@')[0],
          code: newCode,
        },
      });

      return new CustomApiResponse(true, 'Verification code sent', null, null);
    } catch (error) {
      return new CustomApiResponse(
        false,
        error.message ?? 'Something went wrong',
        null,
        error,
      );
    }
  }

  async resetPassword(
    data: ResetPasswordDto,
  ): Promise<CustomApiResponse<null>> {
    try {
      const payload = this.jwtService.verify(data.token, {
        secret: env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) throw new NotAcceptableException('User not found');
      if (data.password !== data.confirmPassword)
        throw new NotAcceptableException('Passwords do not match');

      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(data.password, 10) },
      });

      return new CustomApiResponse(
        true,
        'Password reset successful!',
        null,
        null,
      );
    } catch (error) {
      return new CustomApiResponse(
        false,
        error.message ?? 'Password reset failed',
        null,
        error,
      );
    }
  }

  async forgotPassword(
    data: ForgotPasswordDto,
  ): Promise<CustomApiResponse<null>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) throw new NotAcceptableException();

      const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1d' });

      await this.mailingService.sendMail('RESET_PASSWORD_EMAIL', {
        to: user.email,
        subject: 'Reset your password!',
        values: {
          resetLink: `${env.FRONTEND_URL}/auth/reset-password?token=${token}`,
        },
      });

      return new CustomApiResponse(
        true,
        'Check your email to reset your password',
        null,
        null,
      );
    } catch (error) {
      return new CustomApiResponse(false, 'Something went wrong', null, error);
    }
  }

 async verifyAccount(
  data: VerifyAccountDto,
  user: User,
): Promise<CustomApiResponse<UserResponseDto | null>> {
  try {
    const theUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!theUser) throw new NotAcceptableException('User not found');

    if (theUser.isVerified) {
      throw new BadRequestException('Account already verified');
    }

    if (theUser.verificationCode !== data.code) {
      throw new NotAcceptableException('Incorrect verification code');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verificationCode: null,
      },
    });

    const { passwordHash, verificationCode, ...safeUser } = updatedUser;

    return new CustomApiResponse(
      true,
      'Account verified successfully!',
      plainToInstance(UserResponseDto, safeUser),
      null,
    );
  } catch (error) {
    return new CustomApiResponse(
      false,
      error.message ?? 'Something went wrong',
      null,
      error,
    );
  }
}

  generateVerificationCode(): string {
    return crypto.randomBytes(10).toString('hex').slice(0, 6).toUpperCase();
  }
}
