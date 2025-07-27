import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';

@Injectable()
export class GroupMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGroupMemberDto) {
    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id: dto.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${dto.groupId} not found`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // Optional: Check if user is already a member
    const existing = await this.prisma.groupMember.findFirst({
      where: {
        groupId: dto.groupId,
        userId: dto.userId,
      },
    });
    if (existing) {
      throw new Error('User is already a member of this group');
    }

    return this.prisma.groupMember.create({ data: dto });
  }

  async findAll() {
    return this.prisma.groupMember.findMany();
  }

  async findOne(id: string) {
    const member = await this.prisma.groupMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Group member not found');
    return member;
  }

  async update(id: string, dto: UpdateGroupMemberDto) {
    return this.prisma.groupMember.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.groupMember.delete({ where: { id } });
    return { message: 'Group member deleted' };
  }
}
