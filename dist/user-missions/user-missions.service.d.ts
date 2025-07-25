import { PrismaService } from '../prisma/prisma.service';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';
export declare class UserMissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    joinMission(dto: CreateUserMissionDto, userId: string): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    update(id: string, dto: UpdateUserMissionDto, userId: string): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    verify(id: string, verifierId: string): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
}
