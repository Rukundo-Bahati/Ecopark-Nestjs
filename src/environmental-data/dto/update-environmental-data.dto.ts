import { PartialType } from '@nestjs/swagger';
import { CreateEnvironmentalDataDto } from './create-environmental-data.dto';

export class UpdateEnvironmentalDataDto extends PartialType(
  CreateEnvironmentalDataDto,
) {}
