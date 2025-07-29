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
import { UserQuizAttemptsService } from './user-quiz-attempts.service';
import { CreateUserQuizAttemptDto } from './dto/create-user-quiz-attempt.dto';
import { UpdateUserQuizAttemptDto } from './dto/update-user-quiz-attempt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('user-quiz-attempts')
@Controller('user-quiz-attempts')
export class UserQuizAttemptsController {
  constructor(
    private readonly userQuizAttemptsService: UserQuizAttemptsService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(UserQuizAttemptsController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new user quiz attempt' })
  @ApiResponse({
    status: 201,
    description: 'User quiz attempt created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserQuizAttemptDto: CreateUserQuizAttemptDto) {
    this.logger.log(
      `Create user quiz attempt request: user
       ${createUserQuizAttemptDto.userId}, 
       quiz ${createUserQuizAttemptDto.quizId},
        score ${createUserQuizAttemptDto.score}`,'UserQuizAttemptsController'
    );
    const result = await this.userQuizAttemptsService.create(
      createUserQuizAttemptDto,
    );
    this.logger.log(
      `Create user quiz attempt ${result ? 'successful' : 'failed'}: user 
      ${createUserQuizAttemptDto.userId}, quiz 
      ${createUserQuizAttemptDto.quizId}`,'UserQuizAttemptsController'
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user quiz attempts' })
  @ApiResponse({ status: 200, description: 'List of user quiz attempts.' })
  @Get()
  async findAll() {
    this.logger.log('Get all user quiz attempts request','UserQuizAttemptsController');
    const result = await this.userQuizAttemptsService.findAll();
    this.logger.log(
      `Get all user quiz attempts successful, found ${result.length} user quiz attempts`,'UserQuizAttemptsController'
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user quiz attempt by ID' })
  @ApiResponse({ status: 200, description: 'User quiz attempt details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get user quiz attempt request: ${id}` ,'UserQuizAttemptsController');
    const result = await this.userQuizAttemptsService.findOne(id);
    this.logger.log(
      `Get user quiz attempt ${result ? 'successful' : 'failed'}: ${id}`,'UserQuizAttemptsController'
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update a user quiz attempt' })
  @ApiResponse({
    status: 200,
    description: 'User quiz attempt updated successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserQuizAttemptDto: UpdateUserQuizAttemptDto,
  ) {
    this.logger.log(
      `Update user quiz attempt request: ${id}, updates:
       ${JSON.stringify(updateUserQuizAttemptDto)}`,'UserQuizAttemptsController'
    );
    const result = await this.userQuizAttemptsService.update(
      id,
      updateUserQuizAttemptDto,
    );
    this.logger.log(
      `Update user quiz attempt ${result ? 'successful' : 'failed'}: ${id}`,'UserQuizAttemptsController'
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete a user quiz attempt' })
  @ApiResponse({
    status: 200,
    description: 'User quiz attempt deleted successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete user quiz attempt request: ${id}`,'UserQuizAttemptsController');
    const result = await this.userQuizAttemptsService.remove(id);
    this.logger.log(
      `Delete user quiz attempt ${result ? 'successful' : 'failed'}: ${id}`,'UserQuizAttemptsController'
    );
    return result;
  }
}
