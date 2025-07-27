import { Module } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [PrismaModule, MyLoggerModule],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
