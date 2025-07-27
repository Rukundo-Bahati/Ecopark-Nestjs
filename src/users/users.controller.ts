import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.types';
import { Role, User } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDto,ChangeProfilePhotoDto } from './dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @ApiBearerAuth('Bearer')  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getCurrentUser(@Req() req) {
    const user = req.user as { id?: string };
    if (!user?.id) {
      throw new UnauthorizedException('Invalid token: user ID missing');
    }

    this.logger.log(`Get current user request: ${user.id}`, 'UsersController');

    const result = await this.usersService.getCurrentUser(user.id);

    this.logger.log(
      `Get current user ${result.success ? 'successful' : 'failed'}: ${user.id}`,
      'UsersController',
    );

    return result;
  }

  @Put('change-profile-photo')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change profile photo (Requires Authentication)' })
  async changeProfilePhoto(@Req() req, @Body() data: ChangeProfilePhotoDto) {
    const user = req['user'] as User;
    this.logger.log(
      `Change profile photo request: ${user.email}`,
      'UsersController',
    );
    const result = await this.usersService.changeProfilePhoto(data, user);
    this.logger.log(
      `Change profile photo ${result.success ? 'successful' : 'failed'}: ${user.email}`,
      'UsersController',
    );
    return result;
  }

  @Put('remove-profile-photo')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove profile photo (Requires Authentication)' })
  async removeProfilePhoto(@Req() req) {
    const user = req['user'] as User;
    this.logger.log(
      `Remove profile photo request: ${user.email}`,
      'UsersController',
    );
    const result = await this.usersService.removeProfilePhoto(user);
    this.logger.log(
      `Remove profile photo ${result.success ? 'successful' : 'failed'}: ${user.email}`,
      'UsersController',
    );
    return result;
  }

  

    @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiBearerAuth('Bearer')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Get('users')
    @ApiOperation({ summary: 'Get users (Admin Only)' })
    async getUsers(@Query() query: PaginationQueryDto) {
      this.logger.log(
        `Get users request with pagination: ${JSON.stringify(query)}`,
        'UserController',
      );
      const result = await this.usersService.getUsers(query);
      this.logger.log(
        `Get users ${result.success ? 'successful' : 'failed'}`,
        'UsersController',
      );
      return result;
    }
  
    @ApiBearerAuth('Bearer')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get a user by ID' })
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUser(@Param('id') userId: string) {
      this.logger.log(`Get user request: ${userId}`, 'UserController');
      const result = await this.usersService.getUser(userId);
      this.logger.log(
        `Get user ${result.success ? 'successful' : 'failed'}: ${userId}`,
        'UsersController',
      );
      return result;
    }

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(
      `Update user request: ${id}, updates: ${JSON.stringify(updateUserDto)}`,
      'UsersController',
    );
    const result = await this.usersService.update(id, updateUserDto);
    this.logger.log(
      `Update user ${result ? 'successful' : 'failed'}: ${id}`,
      'UsersController',
    );
    return result;
  }

  

    @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiBearerAuth('Bearer')
    @Roles(Role.SUPER_ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user (Admin only)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string) {
      this.logger.log(`Delete user request: ${id}`, 'UserController');
      const result = await this.usersService.deleteUser(id);
      this.logger.log(
        `Delete user ${result.success ? 'successful' : 'failed'}: ${id}`,
        'UsersController',
      );
      return result;
    }
}
