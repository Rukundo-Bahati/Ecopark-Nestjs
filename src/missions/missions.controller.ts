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
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(
    private readonly missionsService: MissionsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(MissionsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new mission' })
  @ApiResponse({ status: 201, description: 'Mission created successfully.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMissionDto: CreateMissionDto, @Req() req) {
    this.logger.log(
      `Create mission request: ${createMissionDto.title} by user ${req.user.id}`,
    );
    const result = await this.missionsService.create(
      createMissionDto,
      req.user.id,
    );
    this.logger.log(
      `Create mission ${result ? 'successful' : 'failed'}: ${createMissionDto.title}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all missions' })
  @ApiResponse({ status: 200, description: 'List of missions.' })
  @Get()
  async findAll() {
    this.logger.log('Get all missions request');
    const result = await this.missionsService.findAll();
    this.logger.log(
      `Get all missions successful, found ${result.length} missions`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a mission by ID' })
  @ApiResponse({ status: 200, description: 'Mission details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get mission request: ${id}`);
    const result = await this.missionsService.findOne(id);
    this.logger.log(`Get mission ${result ? 'successful' : 'failed'}: ${id}`);
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a mission' })
  @ApiResponse({ status: 200, description: 'Mission updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    this.logger.log(
      `Update mission request: ${id}, updates: ${JSON.stringify(updateMissionDto)}`,
    );
    const result = await this.missionsService.update(id, updateMissionDto);
    this.logger.log(
      `Update mission ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a mission' })
  @ApiResponse({ status: 200, description: 'Mission deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete mission request: ${id}`);
    const result = await this.missionsService.remove(id);
    this.logger.log(
      `Delete mission ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
