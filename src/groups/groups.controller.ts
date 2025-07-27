import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(GroupsController.name);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  @Post()
  async create(@Body() dto: CreateGroupDto, @Req() req) {
    this.logger.log(
      `Create group request by user: ${req.user.id}, group name: ${dto.name}`,
    );
    const result = await this.groupsService.create(dto, req.user.id);
    this.logger.log(
      `Create group ${result ? 'successful' : 'failed'}: ${dto.name}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'List of groups.' })
  @Get()
  async findAll() {
    this.logger.log('Get all groups request');
    const result = await this.groupsService.findAll();
    this.logger.log(`Get all groups successful, found ${result.length} groups`);
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, description: 'Group details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get group request: ${id}`);
    const result = await this.groupsService.findOne(id);
    this.logger.log(`Get group ${result ? 'successful' : 'failed'}: ${id}`);
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    this.logger.log(
      `Update group request: ${id}, updates: ${JSON.stringify(dto)}`,
    );
    const result = await this.groupsService.update(id, dto);
    this.logger.log(`Update group ${result ? 'successful' : 'failed'}: ${id}`);
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete group request: ${id}`);
    const result = await this.groupsService.remove(id);
    this.logger.log(`Delete group ${result ? 'successful' : 'failed'}: ${id}`);
    return result;
  }
}
