// import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { type Request } from 'express';
// import { UsersService } from '../../users/users.service';

// type JwtPayload = {
//   sub: string;
// };

// @Injectable()
// export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         AccessTokenStrategy.extractFromCookie,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       secretOrKey: process.env?.JWT_ACCESS_SECRET,
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const { sub } = payload;
//     const user = await this.usersService.findById(sub);
//     if (!user) throw new ForbiddenException('Access dined');

//     return user;
//   }

//   private static extractFromCookie(req: Request): string | null {
//     const { cookies } = req;
//     const { accessToken } = cookies || {};
//     if (!accessToken) {
//       return null;
//     }

//     return accessToken;
//   }
// }
