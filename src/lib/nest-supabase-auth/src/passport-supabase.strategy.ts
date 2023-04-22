import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from 'passport-strategy';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UNAUTHORIZED, SUPABASE_AUTH } from './constants';
import { TSupabaseAuthStrategyOptions } from './types';

export class SupabaseAuthStrategy extends Strategy {
  readonly name = SUPABASE_AUTH;

  private readonly supabase: SupabaseClient;

  private extractor: JwtFromRequestFunction;

  success: (user: any, info: any) => void;

  constructor(options: TSupabaseAuthStrategyOptions) {
    super();
    if (!options.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }

    this.supabase = createClient(
      options.supabaseUrl,
      options.supabaseKey,
      options.supabaseOptions || {},
    );
    this.extractor = options.extractor;
  }

  async validate(payload: any): Promise<User> {
    return payload;
  }

  async authenticate(req: Request): Promise<void> {
    const token = this.extractor(req);

    if (!token) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error) throw error;

      this.validateSupabaseResponse(data);
    } catch (error) {
      this.fail(error.message, 401);
    }
  }

  private async validateSupabaseResponse({ user }: { user: User }) {
    const result = await this.validate({ user });

    if (result) {
      this.success(result, {});
      return;
    }

    this.fail(UNAUTHORIZED, 401);
  }
}
