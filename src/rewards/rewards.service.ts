import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({ data: dto });
  }

  async findAll() {
    return this.prisma.reward.findMany();
  }

  async findOne(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async update(id: string, dto: UpdateRewardDto) {
    return this.prisma.reward.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.reward.delete({ where: { id } });
    return { message: 'Reward deleted' };
  }
}
