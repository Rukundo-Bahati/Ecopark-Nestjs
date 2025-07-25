import { Module } from '@nestjs/common';
import { UserMissionsService } from './user-missions.service';
import { UserMissionsController } from './user-missions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserMissionsController],
  providers: [UserMissionsService, PrismaService],
})
export class UserMissionsModule {}
