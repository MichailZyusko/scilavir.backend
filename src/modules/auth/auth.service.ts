import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { Role } from '../users/enums/users.enums';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) { }

  async signUp(createUserDto: CreateUserDto) {
    const {
      email, password, phone, ...data
    } = createUserDto;

    await this.databaseService.signUp({
      email,
      password,
      phone,
      options: {
        data: {
          ...data,
          role: Role.user,
        },
        emailRedirectTo: process.env.WEB_APP_LINK,
      },
    });
  }

  async signIn({ email, password }: SignInDto) {
    const { session } = await this.databaseService.signIn({
      email,
      password,
    });

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  }

  async signOut() {
    return this.databaseService.signOut();
  }

  async refreshTokens(refreshToken: string) {
    const { session } = await this.databaseService.refresh(refreshToken);

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  }
}
