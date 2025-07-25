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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_missions_service_1 = require("./user-missions.service");
const create_user_mission_dto_1 = require("./dto/create-user-mission.dto");
const update_user_mission_dto_1 = require("./dto/update-user-mission.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserMissionsController = class UserMissionsController {
    userMissionsService;
    constructor(userMissionsService) {
        this.userMissionsService = userMissionsService;
    }
    async join(dto, req) {
        return this.userMissionsService.joinMission(dto, req.user.userId);
    }
    async findAll(req) {
        return this.userMissionsService.findAll(req.user.userId);
    }
    async findOne(id, req) {
        return this.userMissionsService.findOne(id, req.user.userId);
    }
    async update(id, dto, req) {
        return this.userMissionsService.update(id, dto, req.user.userId);
    }
    async verify(id, req) {
        if (req.user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admin can verify');
        return this.userMissionsService.verify(id, req.user.userId);
    }
};
exports.UserMissionsController = UserMissionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join a mission' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_mission_dto_1.CreateUserMissionDto, Object]),
    __metadata("design:returntype", Promise)
], UserMissionsController.prototype, "join", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user missions for current user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserMissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a user mission by ID (current user)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserMissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user mission (current user)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_mission_dto_1.UpdateUserMissionDto, Object]),
    __metadata("design:returntype", Promise)
], UserMissionsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a user mission (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserMissionsController.prototype, "verify", null);
exports.UserMissionsController = UserMissionsController = __decorate([
    (0, swagger_1.ApiTags)('user-missions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('user-missions'),
    __metadata("design:paramtypes", [user_missions_service_1.UserMissionsService])
], UserMissionsController);
//# sourceMappingURL=user-missions.controller.js.map