import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'randomsupersecret',
    });
  }

  async validate(payload: any) {
    //console.log('JWT payload:', payload);
    if (!payload || !payload.id || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
