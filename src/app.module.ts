import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MissionsModule } from './missions/missions.module';
import { UserMissionsModule } from './user-missions/user-missions.module';
import { PrismaModule } from './prisma/prisma.module';

// Add these:
import { GroupsModule } from './groups/groups.module';
import { ChallengesModule } from './challenges/challenges.module';
import { RewardsModule } from './rewards/rewards.module';
import { UserRewardsModule } from './user-rewards/user-rewards.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuizQuestionsModule } from './quiz-questions/quiz-questions.module';
import { UserQuizAttemptsModule } from './user-quiz-attempts/user-quiz-attempts.module';
import { EnvironmentalDataModule } from './environmental-data/environmental-data.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { MyLoggerModule } from './my-logger/my-logger.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    AuthModule,
    UsersModule,
    MissionsModule,
    UserMissionsModule,
    PrismaModule,
    GroupsModule,
    GroupMembersModule,
    ChallengesModule,
    RewardsModule,
    UserRewardsModule,
    QuizzesModule,
    QuizQuestionsModule,
    UserQuizAttemptsModule,
    EnvironmentalDataModule,
    MyLoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
