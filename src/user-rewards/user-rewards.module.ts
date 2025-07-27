import { Module } from '@nestjs/common';
import { UserRewardsService } from './user-rewards.service';
import { UserRewardsController } from './user-rewards.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [PrismaModule, MyLoggerModule],
  controllers: [UserRewardsController],
  providers: [UserRewardsService],
  exports: [UserRewardsService],
})
export class UserRewardsModule {}
