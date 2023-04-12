import { Injectable } from '@nestjs/common';
import {
  createClient, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, SupabaseClient,
} from '@supabase/supabase-js';

@Injectable()
export class DatabaseService {
  readonly database: SupabaseClient;

  constructor() {
    this.database = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
      {
        auth: {
          autoRefreshToken: true,
        },
      },
    );
  }

  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { error } = await this.database.auth.signUp(credentials);

    if (error) {
      throw error;
    }
  }

  async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await this.database.auth
      .signInWithPassword(credentials);

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await this.database.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async refresh(refreshToken) {
    const { data, error } = await this.database.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }

    return data;
  }
}
