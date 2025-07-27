import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChallengeDto) {
    return this.prisma.challenge.create({ data: dto });
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
