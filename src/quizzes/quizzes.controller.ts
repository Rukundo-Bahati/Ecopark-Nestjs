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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.types';
import { Role } from '@prisma/client';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(QuizzesController.name);
  }

@ApiBearerAuth('Bearer')
@ApiOperation({ summary: 'Create a new quiz' })
@ApiResponse({ status: 201, description: 'Quiz created successfully.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN,Role.ADMIN)
@Post()
async create(
  @Body() createQuizDto: CreateQuizDto,
  @Req() req: Request
): Promise<any> {
  const userId = (req.user as any)?.id; 

  this.logger.log(
    `Create quiz request: ${createQuizDto.title}`,
    'QuizzesController',
  );
  this.logger.log(`User from request: ${JSON.stringify(req.user)}`, 'QuizzesController');


  const result = await this.quizzesService.createQuiz(createQuizDto, userId);

  this.logger.log(
    `Create quiz ${result ? 'successful' : 'failed'}: ${createQuizDto.title}`,
    'QuizzesController',
  );

  return result;
}

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of quizzes.' })
  @Get()
  async findAll() {
    this.logger.log('Get all quizzes request', 'QuizzesController');
    const result = await this.quizzesService.findAll();
    this.logger.log(
      `Get all quizzes successful, found ${result.length} quizzes`,
      'QuizzesController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a quiz by ID' })
  @ApiResponse({ status: 200, description: 'Quiz details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get quiz request: ${id}`, 'QuizzesController');
    const result = await this.quizzesService.findOne(id);
    this.logger.log(
      `Get quiz ${result ? 'successful' : 'failed'}: ${id}`,
      'QuizzesController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    this.logger.log(
      `Update quiz request: ${id}, updates: ${JSON.stringify(updateQuizDto)}`,
      'QuizzesController',
    );
    const result = await this.quizzesService.update(id, updateQuizDto);
    this.logger.log(
      `Update quiz ${result ? 'successful' : 'failed'}: ${id}`,
      'QuizzesController',
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully.' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete quiz request: ${id}`, 'QuizzesController');
    const result = await this.quizzesService.remove(id);
    this.logger.log(
      `Delete quiz ${result ? 'successful' : 'failed'}: ${id}`,
      'QuizzesController',
    );
    return result;
  }
}
