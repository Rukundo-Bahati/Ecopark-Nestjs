import { Role } from "@prisma/client";
export declare class ApiResponse<T = Record<string, any>> {
    success: boolean;
    message: string;
    data: T | null;
    error?: any;
    constructor(success: boolean, message: string, data?: T | null, error?: any);
}
export declare class UserResponseDto {
    id: string;
    email: string;
    displayName: string;
    role: Role;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
