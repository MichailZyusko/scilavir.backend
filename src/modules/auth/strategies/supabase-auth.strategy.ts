import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from '../../../lib/nest-supabase-auth';

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

  async authenticate(req: any) {
    super.authenticate(req);
  }
}
