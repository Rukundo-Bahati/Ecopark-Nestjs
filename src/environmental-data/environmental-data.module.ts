import { Module } from '@nestjs/common';
import { EnvironmentalDataService } from './environmental-data.service';
import { EnvironmentalDataController } from './environmental-data.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [PrismaModule, MyLoggerModule],
  controllers: [EnvironmentalDataController],
  providers: [EnvironmentalDataService],
  exports: [EnvironmentalDataService],
})
export class EnvironmentalDataModule {}
