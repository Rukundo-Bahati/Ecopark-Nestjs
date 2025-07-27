import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRewardsService } from './user-rewards.service';
import { CreateUserRewardDto } from './dto/create-user-reward.dto';
import { UpdateUserRewardDto } from './dto/update-user-reward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('user-rewards')
@Controller('user-rewards')
export class UserRewardsController {
  constructor(
    private readonly userRewardsService: UserRewardsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(UserRewardsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new user reward' })
  @ApiResponse({
    status: 201,
    description: 'User reward created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserRewardDto: CreateUserRewardDto) {
    this.logger.log(
      `Create user reward request: user ${createUserRewardDto.userId}, reward ${createUserRewardDto.rewardId}`,
    );
    const result = await this.userRewardsService.create(createUserRewardDto);
    this.logger.log(
      `Create user reward ${result ? 'successful' : 'failed'}: user ${createUserRewardDto.userId}, reward ${createUserRewardDto.rewardId}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user rewards' })
  @ApiResponse({ status: 200, description: 'List of user rewards.' })
  @Get()
  async findAll() {
    this.logger.log('Get all user rewards request');
    const result = await this.userRewardsService.findAll();
    this.logger.log(
      `Get all user rewards successful, found ${result.length} user rewards`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user reward by ID' })
  @ApiResponse({ status: 200, description: 'User reward details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get user reward request: ${id}`);
    const result = await this.userRewardsService.findOne(id);
    this.logger.log(
      `Get user reward ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a user reward' })
  @ApiResponse({
    status: 200,
    description: 'User reward updated successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserRewardDto: UpdateUserRewardDto,
  ) {
    this.logger.log(
      `Update user reward request: ${id}, updates: ${JSON.stringify(updateUserRewardDto)}`,
    );
    const result = await this.userRewardsService.update(
      id,
      updateUserRewardDto,
    );
    this.logger.log(
      `Update user reward ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a user reward' })
  @ApiResponse({
    status: 200,
    description: 'User reward deleted successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete user reward request: ${id}`);
    const result = await this.userRewardsService.remove(id);
    this.logger.log(
      `Delete user reward ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
