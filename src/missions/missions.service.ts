import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMissionDto, userId: string) {
    return this.prisma.mission.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.mission.findMany();
  }

  async findOne(id: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async update(id: string, dto: UpdateMissionDto) {
    return this.prisma.mission.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.mission.delete({ where: { id } });
    return { message: 'Mission deleted' };
  }
}
