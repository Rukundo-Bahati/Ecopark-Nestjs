"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMissionsModule = void 0;
const common_1 = require("@nestjs/common");
const user_missions_service_1 = require("./user-missions.service");
const user_missions_controller_1 = require("./user-missions.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let UserMissionsModule = class UserMissionsModule {
};
exports.UserMissionsModule = UserMissionsModule;
exports.UserMissionsModule = UserMissionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_missions_controller_1.UserMissionsController],
        providers: [user_missions_service_1.UserMissionsService, prisma_service_1.PrismaService],
    })
], UserMissionsModule);
//# sourceMappingURL=user-missions.module.js.map