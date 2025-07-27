import { PartialType } from '@nestjs/swagger';
import { CreateUserQuizAttemptDto } from './create-user-quiz-attempt.dto';

export class UpdateUserQuizAttemptDto extends PartialType(
  CreateUserQuizAttemptDto,
) {}
