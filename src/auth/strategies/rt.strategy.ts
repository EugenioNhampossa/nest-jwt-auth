import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refresh-secret-key',
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}