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
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(
    private readonly rewardsService: RewardsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(RewardsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'Reward created successfully.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRewardDto: CreateRewardDto, @Req() req) {
  console.log('req.user:', req.user); // 
    
    this.logger.log(
      `Create reward request: ${createRewardDto.name}`,
      'RewardsController',
    );
    const result = await this.rewardsService.create(createRewardDto);
    this.logger.log(
      `Create reward ${result ? 'successful' : 'failed'}: ${createRewardDto.name}`,
      'RewardsController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiResponse({ status: 200, description: 'List of rewards.' })
  @Get()
  async findAll() {
    this.logger.log('Get all rewards request', 'RewardsController');
    const result = await this.rewardsService.findAll();
    this.logger.log(
      `Get all rewards successful, found ${result.length} rewards`,
      'RewardsController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get reward request: ${id}`, 'RewardsController');
    const result = await this.rewardsService.findOne(id);
    this.logger.log(
      `Get reward ${result ? 'successful' : 'failed'}: ${id}`,
      'RewardsController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a reward' })
  @ApiResponse({ status: 200, description: 'Reward updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    this.logger.log(
      `Update reward request: ${id}, updates: ${JSON.stringify(updateRewardDto)}`,
      'RewardsController',
    );
    const result = await this.rewardsService.update(id, updateRewardDto);
    this.logger.log(
      `Update reward ${result ? 'successful' : 'failed'}: ${id}`,
      'RewardsController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a reward' })
  @ApiResponse({ status: 200, description: 'Reward deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete reward request: ${id}`, 'RewardsController');
    const result = await this.rewardsService.remove(id);
    this.logger.log(
      `Delete reward ${result ? 'successful' : 'failed'}: ${id}`,
      'RewardsController',
    );
    return result;
  }
}
