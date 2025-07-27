import { Module } from '@nestjs/common';
import { UserMissionsService } from './user-missions.service';
import { UserMissionsController } from './user-missions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [PrismaModule, MyLoggerModule],
  controllers: [UserMissionsController],
  providers: [UserMissionsService],
  exports: [UserMissionsService],
})
export class UserMissionsModule {}
