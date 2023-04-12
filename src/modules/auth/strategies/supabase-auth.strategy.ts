import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  'supabase',
) {
  constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_API_KEY,
      supabaseOptions: {
        auth: {
          autoRefreshToken: true,
        },
      },
      // supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ user }: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException('You need be authenticated to perform this action');
    }

    return user;
    // super.validate(payload);
  }

  authenticate(req: any) {
    super.authenticate(req);
  }
}
