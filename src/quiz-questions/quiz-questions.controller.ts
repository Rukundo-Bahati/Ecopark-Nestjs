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
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('quiz-questions')
@Controller('quiz-questions')
export class QuizQuestionsController {
  constructor(
    private readonly quizQuestionsService: QuizQuestionsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(QuizQuestionsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new quiz question' })
  @ApiResponse({
    status: 201,
    description: 'Quiz question created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    this.logger.log(
      `Create quiz question request: quiz ${createQuizQuestionDto.quizId}, question: ${createQuizQuestionDto.questionText.substring(0, 50)}...`,
    );
    const result = await this.quizQuestionsService.create(
      createQuizQuestionDto,
    );
    this.logger.log(
      `Create quiz question ${result ? 'successful' : 'failed'}: quiz ${createQuizQuestionDto.quizId}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all quiz questions' })
  @ApiResponse({ status: 200, description: 'List of quiz questions.' })
  @Get()
  async findAll() {
    this.logger.log('Get all quiz questions request');
    const result = await this.quizQuestionsService.findAll();
    this.logger.log(
      `Get all quiz questions successful, found ${result.length} quiz questions`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a quiz question by ID' })
  @ApiResponse({ status: 200, description: 'Quiz question details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get quiz question request: ${id}`);
    const result = await this.quizQuestionsService.findOne(id);
    this.logger.log(
      `Get quiz question ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a quiz question' })
  @ApiResponse({
    status: 200,
    description: 'Quiz question updated successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
  ) {
    this.logger.log(
      `Update quiz question request: ${id}, updates: ${JSON.stringify(updateQuizQuestionDto)}`,
    );
    const result = await this.quizQuestionsService.update(
      id,
      updateQuizQuestionDto,
    );
    this.logger.log(
      `Update quiz question ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a quiz question' })
  @ApiResponse({
    status: 200,
    description: 'Quiz question deleted successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete quiz question request: ${id}`);
    const result = await this.quizQuestionsService.remove(id);
    this.logger.log(
      `Delete quiz question ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
