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
exports.UserMissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_user_mission_dto_1 = require("./dto/create-user-mission.dto");
let UserMissionsService = class UserMissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async joinMission(dto, userId) {
        const exists = await this.prisma.userMission.findFirst({ where: { userId, missionId: dto.missionId } });
        if (exists)
            throw new common_1.ForbiddenException('Already joined this mission');
        return this.prisma.userMission.create({
            data: {
                userId,
                missionId: dto.missionId,
                status: dto.status || create_user_mission_dto_1.UserMissionStatus.PENDING,
                proofUrl: dto.proofUrl,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.userMission.findMany({ where: { userId } });
    }
    async findOne(id, userId) {
        const userMission = await this.prisma.userMission.findUnique({ where: { id } });
        if (!userMission || userMission.userId !== userId)
            throw new common_1.NotFoundException('User mission not found');
        return userMission;
    }
    async update(id, dto, userId) {
        const userMission = await this.prisma.userMission.findUnique({ where: { id } });
        if (!userMission || userMission.userId !== userId)
            throw new common_1.NotFoundException('User mission not found');
        return this.prisma.userMission.update({ where: { id }, data: dto });
    }
    async verify(id, verifierId) {
        const userMission = await this.prisma.userMission.findUnique({ where: { id } });
        if (!userMission)
            throw new common_1.NotFoundException('User mission not found');
        return this.prisma.userMission.update({
            where: { id },
            data: { status: create_user_mission_dto_1.UserMissionStatus.VERIFIED, verifiedAt: new Date(), verifierId },
        });
    }
};
exports.UserMissionsService = UserMissionsService;
exports.UserMissionsService = UserMissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserMissionsService);
//# sourceMappingURL=user-missions.service.js.map