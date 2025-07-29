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
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.types';
import { Role } from '@prisma/client';

@ApiTags('topics')
@Controller('topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('Bearer')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(TopicsController.name);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created successfully.' })
  async create(@Body() createTopicDto: CreateTopicDto, @Req() req) {
    this.logger.log(`Create topic request: ${createTopicDto.title}`);
    const result = await this.topicsService.create(createTopicDto);
    this.logger.log(
      `Create topic ${result ? 'successful' : 'failed'}: ${createTopicDto.title}`,
    );
    return result;
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'List of topics.' })
  async findAll() {
    this.logger.log('Get all topics request');
    const result = await this.topicsService.findAll();
    this.logger.log(`Get all topics successful, found ${result.length}`);
    return result;
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Topic details.' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get topic request: ${id}`,'TopicsController');
    const result = await this.topicsService.findOne(id);
    this.logger.log(`Get topic ${result ? 'successful' : 'failed'}: ${id}`,'TopicsController');
    return result;
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a topic' })
  @ApiResponse({ status: 200, description: 'Topic updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    this.logger.log(
      `Update topic request: ${id}, updates: ${JSON.stringify(updateTopicDto)}`,'TopicsController'
    );
    const result = await this.topicsService.update(id, updateTopicDto);
    this.logger.log(`Update topic ${result ? 'successful' : 'failed'}: ${id}`,'TopicsController');
    return result;
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiResponse({ status: 200, description: 'Topic deleted successfully.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete topic request: ${id}`,'TopicsController');
    const result = await this.topicsService.deleteTopic(id);
    this.logger.log(`Delete topic ${result ? 'successful' : 'failed'}: ${id}`,'TopicsController');
    return result;
  }
}
