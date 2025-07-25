import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
    }>;
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
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
    }>;
    removeMe(req: any): Promise<{
        message: string;
    }>;
}
