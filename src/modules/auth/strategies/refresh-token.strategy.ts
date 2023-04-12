// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request } from 'express';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         RefreshTokenStrategy.extractFromCookie,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       secretOrKey: process.env.JWT_REFRESH_SECRET,
//       passReqToCallback: true,
//     });
//   }

//   validate(req: Request, payload: any) {
//     const { cookies } = req;
//     const { refreshToken: refreshTokenFromCookie } = cookies || {};

//     if (!refreshTokenFromCookie) {
//       const refreshTokenFromHeaders = req.get('Authorization').replace('Bearer', '').trim();

//       return { ...payload, refreshToken: refreshTokenFromHeaders };
//     }

//     return { ...payload, refreshToken: refreshTokenFromCookie };
//   }

//   private static extractFromCookie(req: Request): string | null {
//     const { cookies } = req;
//     const { refreshToken } = cookies || {};
//     if (!refreshToken) {
//       return null;
//     }

//     return refreshToken;
//   }
// }
