import {
  Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SupabaseGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', refreshToken, { httpOnly: true });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  async signIn(@Body() logInDto: SignInDto) {
    return this.authService.signIn(logInDto);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', refreshToken, { httpOnly: true });

    // return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(SupabaseGuard)
  @Delete('sign-out')
  async signOut() {
    await this.authService.signOut();

    // res.cookie('token', '', { expires: new Date() });
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SupabaseGuard)
  @Post('refresh')
  async refreshTokens() {
    return this.authService.refreshTokens();

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', newRefreshToken, { httpOnly: true });
  }
}
