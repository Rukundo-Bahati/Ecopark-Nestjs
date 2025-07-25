import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MissionsModule } from './missions/missions.module';
import { UserMissionsModule } from './user-missions/user-missions.module';
import { PrismaModule } from './prisma/prisma.module';
// Import feature modules here as you implement them

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3,
    },{
      name: 'long',
      ttl: 60000,
      limit: 100,
    }]),
    
    AuthModule,
    UsersModule,
    MissionsModule,
    UserMissionsModule,
    PrismaModule,
    //DatabaseModule,
    // Add feature modules here
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})
export class AppModule {}
