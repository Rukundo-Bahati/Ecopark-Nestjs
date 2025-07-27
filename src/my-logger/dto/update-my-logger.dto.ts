import { PartialType } from '@nestjs/swagger';
import { CreateMyLoggerDto } from './create-my-logger.dto';

export class UpdateMyLoggerDto extends PartialType(CreateMyLoggerDto) {}
