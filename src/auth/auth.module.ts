import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { MailingModule } from 'src/mailing/mailing.module';
import { MyLoggerModule } from '../my-logger/my-logger.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    MailingModule,
    PassportModule,
    MyLoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'randomsupersecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService,JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService,JwtAuthGuard],
})
export class AuthModule {}
