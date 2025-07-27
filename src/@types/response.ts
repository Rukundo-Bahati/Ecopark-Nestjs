import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class CustomApiResponse<T = Record<string, any>> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null = null,
    public error?: any,
  ) {}
}

export class UserResponseDto {
  id: string;
  email: string;
  displayName: string;
  profilePhoto?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  passwordHash: string;
}
