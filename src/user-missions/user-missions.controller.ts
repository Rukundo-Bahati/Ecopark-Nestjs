import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserMissionsService } from './user-missions.service';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('user-missions')
@Controller('user-missions')
export class UserMissionsController {
  constructor(
    private readonly userMissionsService: UserMissionsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(UserMissionsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new user mission' })
  @ApiResponse({
    status: 201,
    description: 'User mission created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async joinMission(
    @Body() createUserMissionDto: CreateUserMissionDto,
    @Req() req,
  ) {
    this.logger.log(
      `User ${req.user.id} joining mission ${createUserMissionDto.missionId}`,
    );
    const result = await this.userMissionsService.joinMission(
      createUserMissionDto,
      req.user.id,
    );
    this.logger.log(
      `User mission join ${result ? 'successful' : 'failed'}: user ${req.user.id}, mission ${createUserMissionDto.missionId}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user missions' })
  @ApiResponse({ status: 200, description: 'List of user missions.' })
  @Get()
  async findAll(@Req() req) {
    this.logger.log(`Get all user missions request for user ${req.user.id}`);
    const result = await this.userMissionsService.findAll(req.user.id);
    this.logger.log(
      `Get all user missions successful, found ${result.length} user missions for user ${req.user.id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user mission by ID' })
  @ApiResponse({ status: 200, description: 'User mission details.' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    this.logger.log(`Get user mission request: ${id} for user ${req.user.id}`);
    const result = await this.userMissionsService.findOne(id, req.user.id);
    this.logger.log(
      `Get user mission ${result ? 'successful' : 'failed'}: ${id} for user ${req.user.id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a user mission' })
  @ApiResponse({
    status: 200,
    description: 'User mission updated successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserMissionDto: UpdateUserMissionDto,
    @Req() req,
  ) {
    this.logger.log(
      `Update user mission request: ${id} for user ${req.user.id}, updates: ${JSON.stringify(updateUserMissionDto)}`,
    );
    const result = await this.userMissionsService.update(
      id,
      updateUserMissionDto,
      req.user.id,
    );
    this.logger.log(
      `Update user mission ${result ? 'successful' : 'failed'}: ${id} for user ${req.user.id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a user mission' })
  @ApiResponse({
    status: 200,
    description: 'User mission deleted successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    this.logger.log(
      `Delete user mission request: ${id} for user ${req.user.id}`,
    );
    const result = await this.userMissionsService.remove(id, req.user.id);
    this.logger.log(
      `Delete user mission ${result ? 'successful' : 'failed'}: ${id} for user ${req.user.id}`,
    );
    return result;
  }
}
