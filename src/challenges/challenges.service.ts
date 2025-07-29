import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChallengeDto, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: dto.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with id ${dto.groupId} not found`);
    }
    
    return this.prisma.challenge.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        difficulty: dto.difficulty,
        category: dto.category,
        reward: dto.reward,
        createdBy: {
          connect: { id: userId },
        },
        group: {
          connect: { id: dto.groupId },
        },
      },
    });
  }
  

  async findAll() {
    return this.prisma.challenge.findMany();
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async update(id: string, dto: UpdateChallengeDto) {
    return this.prisma.challenge.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.challenge.delete({ where: { id } });
    return { message: 'Challenge deleted' };
  }
}
