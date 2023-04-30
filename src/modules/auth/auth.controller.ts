import {
  Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@supabase/supabase-js';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SupabaseGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', refreshToken, { httpOnly: true });

    // return { accessToken, refreshToken };
  }

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

  // @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request) {
    const { authorization } = req.headers as any;
    const refreshToken = authorization.replace('Bearer', '').trim();

    return this.authService.refreshTokens(refreshToken);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', newRefreshToken, { httpOnly: true });
  }

  @UseGuards(SupabaseGuard)
  @Post('reset-password')
  async resetPassword(@CurrentUser() user: User) {
    return this.authService.resetPassword(user);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', refreshToken, { httpOnly: true });

    // return { accessToken, refreshToken };
  }

  // @UseGuards(SupabaseGuard)
  @Post('update-password')
  async updatePassword(@Body('password') password: string) {
    return this.authService.updatePassword(password);

    // res.cookie('a-token', accessToken, { httpOnly: true });
    // res.cookie('r-token', refreshToken, { httpOnly: true });

    // return { accessToken, refreshToken };
  }
}
