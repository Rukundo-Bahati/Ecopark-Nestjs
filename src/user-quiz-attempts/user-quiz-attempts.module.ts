import { Module } from '@nestjs/common';
import { UserQuizAttemptsService } from './user-quiz-attempts.service';
import { UserQuizAttemptsController } from './user-quiz-attempts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [PrismaModule, MyLoggerModule],
  controllers: [UserQuizAttemptsController],
  providers: [UserQuizAttemptsService],
  exports: [UserQuizAttemptsService],
})
export class UserQuizAttemptsModule {}
