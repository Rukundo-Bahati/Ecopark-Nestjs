"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    error;
    constructor(success, message, data = null, error) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.ApiResponse = ApiResponse;
class UserResponseDto {
    id;
    email;
    displayName;
    role;
    avatarUrl;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=response.js.map