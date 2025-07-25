import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("../@types/response").ApiResponse<{
        token: string;
        user: import(".prisma/client").User;
    }>>;
    login(dto: LoginDto, req: Request): Promise<import("../@types/response").ApiResponse<{
        token: string;
        user: import(".prisma/client").User;
    }>>;
}
