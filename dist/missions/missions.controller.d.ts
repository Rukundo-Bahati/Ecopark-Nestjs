import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
export declare class MissionsController {
    private readonly missionsService;
    constructor(missionsService: MissionsService);
    create(dto: CreateMissionDto, req: any): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: string;
        rewardPoints: number;
        category: string;
        isActive: boolean;
        createdById: string;
    }>;
    findAll(): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: string;
        rewardPoints: number;
        category: string;
        isActive: boolean;
        createdById: string;
    }[]>;
    findOne(id: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: string;
        rewardPoints: number;
        category: string;
        isActive: boolean;
        createdById: string;
    }>;
    update(id: string, dto: UpdateMissionDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: string;
        rewardPoints: number;
        category: string;
        isActive: boolean;
        createdById: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
