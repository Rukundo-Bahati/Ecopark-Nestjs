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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

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
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    this.logger.log(
      `Create quiz request: ${createQuizDto.title}`,
      'QuizzesController',
    );
    const result = await this.quizzesService.create(createQuizDto);
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
