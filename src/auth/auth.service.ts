import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role, User } from '@prisma/client'
import { ApiResponse, UserResponseDto } from 'src/@types/response';
import { MailingService } from 'src/mailing/mailing.service';
import env from 'src/utils/env';
import { ChangeProfilePhotoDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyAccountDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mailingService: MailingService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto,
    req: Request,): Promise<ApiResponse<{ token: string; user: User }>> {
    try{
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email
        },
      })

      if (!user) throw new NotFoundException('Invalid credentials');
      if (!user.isVerified) {
        this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
          to: user.email,
          subject: 'Verify your account to continue',
          values: {
            name: user.email.split('@')[0],
            code: user.verificationCode,
          },
        });
        return new (ApiResponse as any)(false, 'This account is not verified!', null);
      }


      const passwords_match = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      if (!passwords_match)
        throw new NotAcceptableException('Invalid credentials');

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return new (ApiResponse as any)(true, '...', {
        token,
        user: plainToInstance(UserResponseDto, user),
      });
      

    }  catch (error) {
      console.log(error);
      return new ApiResponse<{ token: string; user: User }>(
        false,
        error.message ?? 'Login failed, try again',
        null,
      );
    }
  }

  async register(registerDto: RegisterDto): Promise<ApiResponse<{ token: string; user: User }>>  {
  try {
    if (
      await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      })
    )
      throw new NotAcceptableException('Email taken');
    if (registerDto.password !== registerDto.confirmPassword)
      throw new NotAcceptableException('Passwords do not match');

    const { confirmPassword, ...safeUser } = registerDto; 
    const user = await this.prisma.user.create({
      data: {
        email: safeUser.email.trim(),
        passwordHash: await bcrypt.hash(safeUser.password, 10),
        displayName: safeUser.displayName,
        verificationCode: this.generateVerificationCode(),
        role: safeUser.userRole as Role || Role.USER,
        avatarUrl: safeUser.avatarUrl,
      },
    });

    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7days',
      },
    );

    this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
      to: user.email,
      subject: 'Account Created',
      values: {
        name: registerDto.email.split('@')[0],
        code: user.verificationCode,
      },
    });

    return new ApiResponse(true, 'Signup successful', {
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    return new (ApiResponse as any)(
      false,
      error.message || 'Something went  wrong',
      null,
    );
   }
  }

  async resendCode(user: User) {
    try {
      const theUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if(!theUser) throw new NotFoundException('User not found');

      const newCode = this.generateVerificationCode();
      await this.prisma.user.update({
        where: {
          id: theUser.id,
        },
        data: {
          verificationCode: newCode,
        },
      });

      this.mailingService.sendMail('RESEND_VERIFICATION_CODE', {
        to: user.email,
        subject: `Your verification code is ${newCode}`,
        values: {
          name: user.email.split('@')[0],
          code: user.verificationCode,
        },
      });

      return new ApiResponse(true, 'Verification code sent', null);
    } catch (error) {
      return new ApiResponse(
        false,
        error.message ?? 'Something went wrong',
        null,
      );
    }
  }

  async resetPassword(
    data: ResetPasswordDto,
  ): Promise<ApiResponse<Record<string, any>>> {
    try {
      const payload = this.jwtService.verify(data.token, {
        secret: env.JWT_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        }
      });
      if (!user)
        throw new NotAcceptableException(
          'User not found, create account again',
        );
      if (data.password !== data.confirmPassword)
        throw new NotAcceptableException('Passwords do not match');

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash: await bcrypt.hash(data.password, 10),
        },
      });

      // Then the user is redirected to Login
      return new (ApiResponse as any)(true, 'Password reset successfully!', null);
    } catch (error) {
      return new (ApiResponse as any)(false, 'Password reset failed', null);
    }
  }
  
  async forgotPassword(
    data: ForgotPasswordDto,
  ): Promise<ApiResponse<Record<string, any>>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user) throw new NotAcceptableException();

      const token = this.jwtService.sign(
        { id: user.id },
        {
          expiresIn: '1d',
        },
      );
      this.mailingService.sendMail('RESET_PASSWORD_EMAIL', {
        to: user.email,
        subject: 'Reset your password!',
        values: {
          resetLink: `${env.FRONTEND_URL}/auth/reset-password?token=${token}`,
        },
      });
      return new (ApiResponse as any)(
        true,
        'Check your email for resetting password',
        null,
      );
    } catch (error) {
      return new (ApiResponse as any)(false, 'Something went wrong', null);
    }
  }

  async verifyAccount(
    data: VerifyAccountDto,
    user: User,
  ): Promise<ApiResponse<Record<string, any>>> {
    try {
      const theUser = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!user)
        throw new NotAcceptableException(
          'User not found, create account again',
        );
      if (user.verificationCode != data.code)
        throw new NotAcceptableException('Verification code not correct');
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      });


      const { passwordHash, verificationCode, ...safeUser } = user;  
      

      return new ApiResponse(
        true,
        'Account verified successfully!',
        safeUser,
      );
    } catch (error) {
      return new (ApiResponse as any)(
        false,
        error.message || 'Something went  wrong',
        null,
      );
    }
  }

  async changeProfilePhoto(data: ChangeProfilePhotoDto, user: User) {
    try {
          await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              avatarUrl: data.profilePhoto,
            },
          });
          return new ApiResponse(true, 'Profile photo changed successfully', null);
      }
   
    catch (error) {
      return new ApiResponse(
        false,
        error?.message ?? 'Something went wrong',
        null,
      );
    }
  }
  
  async removeProfilePhoto(user: User) {
    try {
          await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              avatarUrl: null,
            },
          });

      return new ApiResponse(true, 'Profile photo removed successfully', null);
    } catch (error) {
      return new ApiResponse(
        false,
        error?.message ?? 'Something went wrong',
        null,
      );
    }
  }

  async getCurrentUser(
    userId: string,
  ): Promise<ApiResponse<Record<string, any>>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        }
      });
      if (!user) throw new NotAcceptableException('Invalid user id');
      const { passwordHash, verificationCode, ...safeUser } = user; 

      return new ApiResponse(true, 'User profile', safeUser);
    } catch (error) {
      return new (ApiResponse as any)(
        false,
        error.message || 'Something went  wrong',
        null,
      );
    }
  }

  async getUsers(query: PaginationQueryDto) {
    try {
      const { page = 1, items = 10 } = query;
      const skip = (page - 1) * items;

      // Get total count of user
      const total = await this.prisma.user.count();

      // Calculate total pages
      const totalPages = Math.ceil(total / items);
      const users = await this.prisma.user.findMany({
        skip,
        take: items,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const meta = {
        total,
        page,
        limit: items,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        message: 'Users retrieved successfully!',
        data: users,
        meta,
      };
    } catch (error) {
      return new ApiResponse(
        false,
        error.message || 'Something went  wrong',
        null,
      );
    }
  }

  async getUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        }
      });

      if (!user) return new ApiResponse(false, 'Invalid user id!', null);

      return new ApiResponse(true, 'User by id', user);
    } catch (error) {
      return new ApiResponse(
        false,
        error.message || 'Something went wrong',
        null,
        error,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return new ApiResponse(false, 'Invalid user id!', null);
      }

      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isVerified: false,
        },
      });

      return new ApiResponse(true, 'User account deleted!', null);
    } catch (error) {
      return new ApiResponse(
        false,
        'Something went wrong',
        null,
        error.message,
      );
    }
  }

  generateVerificationCode() {
    return crypto.randomBytes(10).toString('hex').slice(0, 6).toUpperCase();
  }
}
