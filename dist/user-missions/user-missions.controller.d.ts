import { UserMissionsService } from './user-missions.service';
import { CreateUserMissionDto } from './dto/create-user-mission.dto';
import { UpdateUserMissionDto } from './dto/update-user-mission.dto';
export declare class UserMissionsController {
    private readonly userMissionsService;
    constructor(userMissionsService: UserMissionsService);
    join(dto: CreateUserMissionDto, req: any): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    update(id: string, dto: UpdateUserMissionDto, req: any): Promise<{
        id: string;
        verifiedAt: Date | null;
        missionId: string;
        status: string;
        proofUrl: string | null;
        userId: string;
        submittedAt: Date | null;
        verifierId: string | null;
    }>;
    verify(id: string, req: any): Promise<{
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
