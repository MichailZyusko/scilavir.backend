import { SupabaseClientOptions } from '@supabase/supabase-js';
import { JwtFromRequestFunction } from 'passport-jwt';

export type TSupabaseAuthStrategyOptions = {
  supabaseUrl: string;
  supabaseKey: string;
  supabaseOptions: SupabaseClientOptions<'public'>;
  extractor: JwtFromRequestFunction;
};
