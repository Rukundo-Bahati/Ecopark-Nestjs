
import { Role } from "@prisma/client";

export class ApiResponse<T = Record<string, any>> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public error?: any;

  constructor(success: boolean, message: string, data: T | null = null, error?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}


export class UserResponseDto {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
