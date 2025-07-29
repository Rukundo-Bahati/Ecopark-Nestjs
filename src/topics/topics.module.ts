// topics.module.ts
import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { PrismaModule } from '../prisma/prisma.module'; // adjust path as needed
import { MyLoggerModule } from 'src/my-logger/my-logger.module';

@Module({
  imports: [PrismaModule,MyLoggerModule], 
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
