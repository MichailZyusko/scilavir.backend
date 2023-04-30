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
    );
    this.database.auth.onAuthStateChange((event, session) => {
      console.log('🚀 ~ file: database.service.ts:17 ~ event, session:', event, session);
    });
  }

  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { error } = await this.database.auth.signUp(credentials);

    if (error) throw error;
  }

  async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await this.database.auth
      .signInWithPassword(credentials);

    if (error) throw error;

    return data;
  }

  async signOut() {
    const { error } = await this.database.auth.signOut();

    if (error) throw error;
  }

  async refresh(refreshToken: string) {
    const { data, error } = await this.database.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw error;

    return data;
  }

  async resetPassword(email: string) {
    const { data, error } = await this.database.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.WEB_APP_LINK}/auth/update-password`,
    });
    if (error) throw error;

    return data;
  }

  async updatePassword(password: string) {
    const { data, error } = await this.database.auth.updateUser({ password });
    if (error) throw error;

    return data;
  }
}
