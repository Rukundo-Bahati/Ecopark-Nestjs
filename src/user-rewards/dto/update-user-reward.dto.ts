import { PartialType } from '@nestjs/swagger';
import { CreateUserRewardDto } from './create-user-reward.dto';

export class UpdateUserRewardDto extends PartialType(CreateUserRewardDto) {}
