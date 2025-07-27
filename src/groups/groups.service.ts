import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGroupDto, userId: string) {
    return this.prisma.group.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.group.findMany();
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: string, dto: UpdateGroupDto) {
    return this.prisma.group.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.group.delete({ where: { id } });
    return { message: 'Group deleted' };
  }
}
