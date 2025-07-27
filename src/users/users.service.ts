import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto,ChangeProfilePhotoDto } from './dto';
import { CustomApiResponse, UserResponseDto } from 'src/@types/response';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(
    query: PaginationQueryDto,
  ): Promise<CustomApiResponse<{ users: User[]; meta: any } | null>> {
    try {
      const { page = 1, items = 10 } = query;
      const skip = (page - 1) * items;

      const total = await this.prisma.user.count();
      const totalPages = Math.ceil(total / items);

      const users = await this.prisma.user.findMany({
        skip,
        take: items,
        orderBy: { createdAt: 'desc' },
      });

      const meta = {
        total,
        page,
        limit: items,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return new CustomApiResponse(true, 'Users retrieved successfully', {
        users,
        meta,
      });
    } catch (error) {
      return new CustomApiResponse(
        false,
        error.message ?? 'Something went wrong',
        null,
        error,
      );
    }
  }

   async getCurrentUser(
    userId: string,
  ): Promise<CustomApiResponse<UserResponseDto | null>> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is missing');
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new NotAcceptableException('Invalid user ID');

      const { passwordHash, verificationCode, ...safeUser } = user;

      return new CustomApiResponse(
        true,
        'User profile fetched successfully',
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

  async getUser(
    userId: string,
  ): Promise<CustomApiResponse<UserResponseDto | null>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new CustomApiResponse(false, 'Invalid user ID', null);
      }

      return new CustomApiResponse(
        true,
        'User fetched by ID',
        plainToInstance(UserResponseDto, user),
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
 

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<CustomApiResponse<UserResponseDto | null>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (dto.email && dto.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });

        if (emailExists) {
          throw new BadRequestException('Email already in use');
        }
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
      });

      const { passwordHash, verificationCode, ...safeUser } = updatedUser;

      return new CustomApiResponse(
        true,
        'User updated successfully',
        plainToInstance(UserResponseDto, safeUser),
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

  async changeProfilePhoto(
      data: ChangeProfilePhotoDto,
      user: User,
    ): Promise<CustomApiResponse<null>> {
      try {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { profilePhoto: data.profilePhoto },
        });
  
        return new CustomApiResponse(
          true,
          'Profile photo updated successfully',
          null,
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
  
    async removeProfilePhoto(user: User): Promise<CustomApiResponse<null>> {
      try {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { profilePhoto: null },
        });
  
        return new CustomApiResponse(
          true,
          'Profile photo removed successfully',
          null,
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
  

  async deleteUser(id: string): Promise<CustomApiResponse<null>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        return new CustomApiResponse(false, 'Invalid user ID', null);
      }

      await this.prisma.user.update({
        where: { id },
        data: { isVerified: false },
      });

      return new CustomApiResponse(true, 'User account deleted!', null);
    } catch (error) {
      return new CustomApiResponse(
        false,
        'Something went wrong',
        null,
        error,
      );
    }
  }
}
