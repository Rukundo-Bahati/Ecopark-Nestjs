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
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('group-members')
@Controller('group-members')
export class GroupMembersController {
  constructor(
    private readonly groupMembersService: GroupMembersService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(GroupMembersController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new group member' })
  @ApiResponse({
    status: 201,
    description: 'Group member created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    this.logger.log(
      `Create group member request: user ${createGroupMemberDto.userId}, group ${createGroupMemberDto.groupId}`,
    );
    const result = await this.groupMembersService.create(createGroupMemberDto);
    this.logger.log(
      `Create group member ${result ? 'successful' : 'failed'}: user ${createGroupMemberDto.userId}, group ${createGroupMemberDto.groupId}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all group members' })
  @ApiResponse({ status: 200, description: 'List of group members.' })
  @Get()
  async findAll() {
    this.logger.log('Get all group members request');
    const result = await this.groupMembersService.findAll();
    this.logger.log(
      `Get all group members successful, found ${result.length} group members`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a group member by ID' })
  @ApiResponse({ status: 200, description: 'Group member details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get group member request: ${id}`);
    const result = await this.groupMembersService.findOne(id);
    this.logger.log(
      `Get group member ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a group member' })
  @ApiResponse({
    status: 200,
    description: 'Group member updated successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    this.logger.log(
      `Update group member request: ${id}, updates: ${JSON.stringify(updateGroupMemberDto)}`,
    );
    const result = await this.groupMembersService.update(
      id,
      updateGroupMemberDto,
    );
    this.logger.log(
      `Update group member ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a group member' })
  @ApiResponse({
    status: 200,
    description: 'Group member deleted successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete group member request: ${id}`);
    const result = await this.groupMembersService.remove(id);
    this.logger.log(
      `Delete group member ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
