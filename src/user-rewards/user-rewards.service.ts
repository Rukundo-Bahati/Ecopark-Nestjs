import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserRewardDto } from './dto/create-user-reward.dto';
import { UpdateUserRewardDto } from './dto/update-user-reward.dto';

@Injectable()
export class UserRewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserRewardDto) {
    return this.prisma.userReward.create({ data: dto });
  }

  async findAll() {
    return this.prisma.userReward.findMany();
  }

  async findOne(id: string) {
    const userReward = await this.prisma.userReward.findUnique({
      where: { id },
    });
    if (!userReward) throw new NotFoundException('User reward not found');
    return userReward;
  }

  async update(id: string, dto: UpdateUserRewardDto) {
    return this.prisma.userReward.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.userReward.delete({ where: { id } });
    return { message: 'User reward deleted' };
  }
}
