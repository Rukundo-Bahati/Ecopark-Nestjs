export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    userRole?: string;
    displayName: string;
    avatarUrl?: string;
}
declare const UpdateAuthDto_base: import("@nestjs/common").Type<Partial<RegisterDto>>;
export declare class UpdateAuthDto extends UpdateAuthDto_base {
}
export declare class ChangeProfilePhotoDto {
    profilePhoto: string;
}
export declare class VerifyAccountDto {
    code: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class WithTokenDto {
    token: string;
}
export declare class ResetPasswordDto extends WithTokenDto {
    password: string;
    confirmPassword: string;
}
export {};
