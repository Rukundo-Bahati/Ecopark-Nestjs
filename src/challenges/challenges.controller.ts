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
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(ChallengesController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiResponse({ status: 201, description: 'Challenge created successfully.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    this.logger.log(`Create challenge request: ${createChallengeDto.title}`);
    const result = await this.challengesService.create(createChallengeDto);
    this.logger.log(
      `Create challenge ${result ? 'successful' : 'failed'}: ${createChallengeDto.title}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all challenges' })
  @ApiResponse({ status: 200, description: 'List of challenges.' })
  @Get()
  async findAll() {
    this.logger.log('Get all challenges request');
    const result = await this.challengesService.findAll();
    this.logger.log(
      `Get all challenges successful, found ${result.length} challenges`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a challenge by ID' })
  @ApiResponse({ status: 200, description: 'Challenge details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get challenge request: ${id}`);
    const result = await this.challengesService.findOne(id);
    this.logger.log(`Get challenge ${result ? 'successful' : 'failed'}: ${id}`);
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    this.logger.log(
      `Update challenge request: ${id}, updates: ${JSON.stringify(updateChallengeDto)}`,
    );
    const result = await this.challengesService.update(id, updateChallengeDto);
    this.logger.log(
      `Update challenge ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete challenge request: ${id}`);
    const result = await this.challengesService.remove(id);
    this.logger.log(
      `Delete challenge ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
