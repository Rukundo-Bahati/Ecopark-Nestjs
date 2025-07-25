"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const client_1 = require("@prisma/client");
const response_1 = require("../@types/response");
const mailing_service_1 = require("../mailing/mailing.service");
const env_1 = require("../utils/env");
const class_transformer_1 = require("class-transformer");
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailingService;
    constructor(prisma, jwtService, mailingService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailingService = mailingService;
    }
    async validateUser(email, pass) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto, req) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: loginDto.email
                },
            });
            if (!user)
                throw new common_1.NotFoundException('Invalid credentials');
            if (!user.isVerified) {
                this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
                    to: user.email,
                    subject: 'Verify your account to continue',
                    values: {
                        name: user.email.split('@')[0],
                        code: user.verificationCode,
                    },
                });
                return new response_1.ApiResponse(false, 'This account is not verified!', null);
            }
            const passwords_match = await bcrypt.compare(loginDto.password, user.passwordHash);
            if (!passwords_match)
                throw new common_1.NotAcceptableException('Invalid credentials');
            const token = this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            return new response_1.ApiResponse(true, '...', {
                token,
                user: (0, class_transformer_1.plainToInstance)(response_1.UserResponseDto, user),
            });
        }
        catch (error) {
            console.log(error);
            return new response_1.ApiResponse(false, error.message ?? 'Login failed, try again', null);
        }
    }
    async register(registerDto) {
        try {
            if (await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            }))
                throw new common_1.NotAcceptableException('Email taken');
            if (registerDto.password !== registerDto.confirmPassword)
                throw new common_1.NotAcceptableException('Passwords do not match');
            const { confirmPassword, ...safeUser } = registerDto;
            const user = await this.prisma.user.create({
                data: {
                    email: safeUser.email.trim(),
                    passwordHash: await bcrypt.hash(safeUser.password, 10),
                    displayName: safeUser.displayName,
                    verificationCode: this.generateVerificationCode(),
                    role: safeUser.userRole || client_1.Role.USER,
                    avatarUrl: safeUser.avatarUrl,
                },
            });
            const token = this.jwtService.sign({
                id: user.id,
                email: user.email,
            }, {
                expiresIn: '7days',
            });
            this.mailingService.sendMail('VERIFY_EMAIL_EMAIL', {
                to: user.email,
                subject: 'Account Created',
                values: {
                    name: registerDto.email.split('@')[0],
                    code: user.verificationCode,
                },
            });
            return new response_1.ApiResponse(true, 'Signup successful', {
                user,
                token,
            });
        }
        catch (error) {
            console.log(error);
            return new response_1.ApiResponse(false, error.message || 'Something went  wrong', null);
        }
    }
    async resendCode(user) {
        try {
            const theUser = await this.prisma.user.findUnique({
                where: { email: user.email },
            });
            if (!theUser)
                throw new common_1.NotFoundException('User not found');
            const newCode = this.generateVerificationCode();
            await this.prisma.user.update({
                where: {
                    id: theUser.id,
                },
                data: {
                    verificationCode: newCode,
                },
            });
            this.mailingService.sendMail('RESEND_VERIFICATION_CODE', {
                to: user.email,
                subject: `Your verification code is ${newCode}`,
                values: {
                    name: user.email.split('@')[0],
                    code: user.verificationCode,
                },
            });
            return new response_1.ApiResponse(true, 'Verification code sent', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error.message ?? 'Something went wrong', null);
        }
    }
    async resetPassword(data) {
        try {
            const payload = this.jwtService.verify(data.token, {
                secret: env_1.default.JWT_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.id,
                }
            });
            if (!user)
                throw new common_1.NotAcceptableException('User not found, create account again');
            if (data.password !== data.confirmPassword)
                throw new common_1.NotAcceptableException('Passwords do not match');
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    passwordHash: await bcrypt.hash(data.password, 10),
                },
            });
            return new response_1.ApiResponse(true, 'Password reset successfully!', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, 'Password reset failed', null);
        }
    }
    async forgotPassword(data) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user)
                throw new common_1.NotAcceptableException();
            const token = this.jwtService.sign({ id: user.id }, {
                expiresIn: '1d',
            });
            this.mailingService.sendMail('RESET_PASSWORD_EMAIL', {
                to: user.email,
                subject: 'Reset your password!',
                values: {
                    resetLink: `${env_1.default.FRONTEND_URL}/auth/reset-password?token=${token}`,
                },
            });
            return new response_1.ApiResponse(true, 'Check your email for resetting password', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, 'Something went wrong', null);
        }
    }
    async verifyAccount(data, user) {
        try {
            const theUser = await this.prisma.user.findUnique({
                where: {
                    id: user.id,
                },
            });
            if (!user)
                throw new common_1.NotAcceptableException('User not found, create account again');
            if (user.verificationCode != data.code)
                throw new common_1.NotAcceptableException('Verification code not correct');
            const updateUser = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    isVerified: true,
                    verifiedAt: new Date(),
                },
            });
            const { passwordHash, verificationCode, ...safeUser } = user;
            return new response_1.ApiResponse(true, 'Account verified successfully!', safeUser);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error.message || 'Something went  wrong', null);
        }
    }
    async changeProfilePhoto(data, user) {
        try {
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    avatarUrl: data.profilePhoto,
                },
            });
            return new response_1.ApiResponse(true, 'Profile photo changed successfully', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error?.message ?? 'Something went wrong', null);
        }
    }
    async removeProfilePhoto(user) {
        try {
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    avatarUrl: null,
                },
            });
            return new response_1.ApiResponse(true, 'Profile photo removed successfully', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error?.message ?? 'Something went wrong', null);
        }
    }
    async getCurrentUser(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });
            if (!user)
                throw new common_1.NotAcceptableException('Invalid user id');
            const { passwordHash, verificationCode, ...safeUser } = user;
            return new response_1.ApiResponse(true, 'User profile', safeUser);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error.message || 'Something went  wrong', null);
        }
    }
    async getUsers(query) {
        try {
            const { page = 1, items = 10 } = query;
            const skip = (page - 1) * items;
            const total = await this.prisma.user.count();
            const totalPages = Math.ceil(total / items);
            const users = await this.prisma.user.findMany({
                skip,
                take: items,
                orderBy: {
                    createdAt: 'desc',
                },
            });
            const meta = {
                total,
                page,
                limit: items,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            };
            return {
                success: true,
                message: 'Users retrieved successfully!',
                data: users,
                meta,
            };
        }
        catch (error) {
            return new response_1.ApiResponse(false, error.message || 'Something went  wrong', null);
        }
    }
    async getUser(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });
            if (!user)
                return new response_1.ApiResponse(false, 'Invalid user id!', null);
            return new response_1.ApiResponse(true, 'User by id', user);
        }
        catch (error) {
            return new response_1.ApiResponse(false, error.message || 'Something went wrong', null, error);
        }
    }
    async deleteUser(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                return new response_1.ApiResponse(false, 'Invalid user id!', null);
            }
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    isVerified: false,
                },
            });
            return new response_1.ApiResponse(true, 'User account deleted!', null);
        }
        catch (error) {
            return new response_1.ApiResponse(false, 'Something went wrong', null, error.message);
        }
    }
    generateVerificationCode() {
        return crypto.randomBytes(10).toString('hex').slice(0, 6).toUpperCase();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mailing_service_1.MailingService])
], AuthService);
//# sourceMappingURL=auth.service.js.map