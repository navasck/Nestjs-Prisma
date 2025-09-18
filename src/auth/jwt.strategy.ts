import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

// This code defines a JWT Strategy for NestJS.Its purpose is to handle the logic for validating a JWT(JSON Web Token) from an incoming request. .It's a key component of the NestJS authentication flow, working in conjunction with @nestjs/passport and a JwtAuthGuard.

// PassportStrategy(Strategy, 'jwt'): This extends PassportStrategy and sets its name to 'jwt'.This name is used by the AuthGuard('jwt') to find and apply this specific strategy.
