import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MissionsController],
  providers: [MissionsService, PrismaService],
})
export class MissionsModule {}
