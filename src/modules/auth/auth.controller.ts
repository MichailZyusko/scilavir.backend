import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

/*
  @deprecated Since start using Clerk
*/
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Post('sign-up')
  // async signUp(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.signUp(createUserDto);

  //   // res.cookie('a-token', accessToken, { httpOnly: true });
  //   // res.cookie('r-token', refreshToken, { httpOnly: true });

  //   // return { accessToken, refreshToken };
  // }

  // @Post('sign-in')
  // async signIn(@Body() logInDto: SignInDto) {
  //   return this.authService.signIn(logInDto);

  //   // res.cookie('a-token', accessToken, { httpOnly: true });
  //   // res.cookie('r-token', refreshToken, { httpOnly: true });

  //   // return { accessToken, refreshToken };
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(SupabaseGuard)
  // @Delete('sign-out')
  // async signOut() {
  //   await this.authService.signOut();

  //   // res.cookie('token', '', { expires: new Date() });
  // }

  // @UseGuards(RefreshTokenGuard)
  // @Post('refresh')
  // async refreshTokens(@Req() req: Request) {
  //   const { authorization } = req.headers as any;
  //   const refreshToken = authorization.replace('Bearer', '').trim();

  //   return this.authService.refreshTokens(refreshToken);

  //   // res.cookie('a-token', accessToken, { httpOnly: true });
  //   // res.cookie('r-token', newRefreshToken, { httpOnly: true });
  // }

  // @UseGuards(SupabaseGuard)
  // @Post('reset-password')
  // async resetPassword(@User() userId: string) {
  // return this.authService.resetPassword(user);

  // res.cookie('a-token', accessToken, { httpOnly: true });
  // res.cookie('r-token', refreshToken, { httpOnly: true });

  // return { accessToken, refreshToken };
  // }

  // @UseGuards(SupabaseGuard)
  // @Post('update-password')
  // async updatePassword(@Body('password') password: string) {
  //   return this.authService.updatePassword(password);

  // res.cookie('a-token', accessToken, { httpOnly: true });
  // res.cookie('r-token', refreshToken, { httpOnly: true });

  // return { accessToken, refreshToken };
  // }
}
