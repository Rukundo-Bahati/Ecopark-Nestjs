import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserMissionDto,
  UserMissionStatus,
} from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';

@Injectable()
export class UserMissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async joinMission(dto: CreateUserMissionDto, userId: string) {
    // Prevent duplicate join
    const exists = await this.prisma.userMission.findFirst({
      where: { userId, missionId: dto.missionId },
    });
    if (exists) throw new ForbiddenException('Already joined this mission');
    return this.prisma.userMission.create({
      data: {
        userId,
        missionId: dto.missionId,
        status: dto.status || UserMissionStatus.PENDING,
        proofUrl: dto.proofUrl,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.userMission.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    const userMission = await this.prisma.userMission.findUnique({
      where: { id },
    });
    if (!userMission || userMission.userId !== userId)
      throw new NotFoundException('User mission not found');
    return userMission;
  }

  async update(id: string, dto: UpdateUserMissionDto, userId: string) {
    const userMission = await this.prisma.userMission.findUnique({
      where: { id },
    });
    if (!userMission || userMission.userId !== userId)
      throw new NotFoundException('User mission not found');
    return this.prisma.userMission.update({ where: { id }, data: dto });
  }

  async verify(id: string, verifierId: string) {
    // Only admin/moderator should be allowed (add role check in controller)
    const userMission = await this.prisma.userMission.findUnique({
      where: { id },
    });
    if (!userMission) throw new NotFoundException('User mission not found');
    return this.prisma.userMission.update({
      where: { id },
      data: {
        status: UserMissionStatus.VERIFIED,
        verifiedAt: new Date(),
        verifierId,
      },
    });
  }

  async remove(id: string, userId: string) {
    const userMission = await this.prisma.userMission.findUnique({
      where: { id },
    });
    if (!userMission || userMission.userId !== userId)
      throw new NotFoundException('User mission not found');
    await this.prisma.userMission.delete({ where: { id } });
    return { message: 'User mission deleted' };
  }
}
