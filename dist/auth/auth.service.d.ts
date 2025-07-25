import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ApiResponse } from 'src/@types/response';
import { MailingService } from 'src/mailing/mailing.service';
import { ChangeProfilePhotoDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyAccountDto } from './dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private mailingService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailingService: MailingService);
    validateUser(email: string, pass: string): Promise<any>;
    login(loginDto: LoginDto, req: Request): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    register(registerDto: RegisterDto): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    resendCode(user: User): Promise<ApiResponse<null>>;
    resetPassword(data: ResetPasswordDto): Promise<ApiResponse<Record<string, any>>>;
    forgotPassword(data: ForgotPasswordDto): Promise<ApiResponse<Record<string, any>>>;
    verifyAccount(data: VerifyAccountDto, user: User): Promise<ApiResponse<Record<string, any>>>;
    changeProfilePhoto(data: ChangeProfilePhotoDto, user: User): Promise<ApiResponse<null>>;
    removeProfilePhoto(user: User): Promise<ApiResponse<null>>;
    getCurrentUser(userId: string): Promise<ApiResponse<Record<string, any>>>;
    getUsers(query: PaginationQueryDto): Promise<ApiResponse<null> | {
        success: boolean;
        message: string;
        data: {
            email: string;
            displayName: string;
            avatarUrl: string | null;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            acceptsTermsOfService: boolean;
            isVerified: boolean;
            verificationCode: string;
            verifiedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getUser(userId: string): Promise<ApiResponse<null> | ApiResponse<{
        email: string;
        displayName: string;
        avatarUrl: string | null;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        acceptsTermsOfService: boolean;
        isVerified: boolean;
        verificationCode: string;
        verifiedAt: Date | null;
    }>>;
    deleteUser(id: string): Promise<ApiResponse<null>>;
    generateVerificationCode(): string;
}
