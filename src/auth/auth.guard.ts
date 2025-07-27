import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import env from 'src/utils/env';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtService: JwtService;
  private readonly prismaService: PrismaService;

  constructor() {
    this.jwtService = new JwtService({
      secret: env.JWT_SECRET,
    });
    this.prismaService = new PrismaService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const url = request.url;
    const method = request.method;

    Logger.log(`${method} ${url}`, 'AuthGuard');

    // Bypass JWT check for public routes
    const openRoutes = [
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/contact-us',
      '/public-profile',
    ];

    if (
      openRoutes.some((route) => url.includes(route)) ||
      (url.includes('assets') && method === 'GET')
    ) {
      return true;
    }

    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const payload = this.jwtService.verify(token, {
        secret: env.JWT_SECRET,
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      request['user'] = user;
      return true;
    } catch (error) {
      Logger.error(error.message, '', 'AuthGuard');
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    Logger.log(`Authorization header: ${authHeader}`, 'AuthGuard');
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
