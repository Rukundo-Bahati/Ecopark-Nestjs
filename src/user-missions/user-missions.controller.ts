import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserMissionsService } from './user-missions.service';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user-missions')
@ApiBearerAuth()
@Controller('user-missions')
export class UserMissionsController {
  constructor(private readonly userMissionsService: UserMissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('join')
  @ApiOperation({ summary: 'Join a mission' })
  async join(@Body() dto: CreateUserMissionDto, @Request() req) {
    return this.userMissionsService.joinMission(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all user missions for current user' })
  async findAll(@Request() req) {
    return this.userMissionsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user mission by ID (current user)' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.userMissionsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user mission (current user)' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserMissionDto, @Request() req) {
    return this.userMissionsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify a user mission (admin only)' })
  async verify(@Param('id') id: string, @Request() req) {
    // TODO: Add role check for admin
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can verify');
    return this.userMissionsService.verify(id, req.user.userId);
  }
}
