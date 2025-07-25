import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
