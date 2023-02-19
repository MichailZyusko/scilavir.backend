import {
  Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards,
} from '@nestjs/common';
import { Payload } from '../token/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  signIn(@Body() logInDto: SignInDto) {
    return this.authService.signIn(logInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  @Post('sign-out')
  signOut(@Req() req: Request & { user: Payload }) {
    return this.authService.signOut(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request & { user: Payload }) {
    const { sub: userId, refreshToken, email } = req.user;

    return this.authService.refreshTokens({
      userId,
      checkingRefreshToken: refreshToken,
      email,
    });
  }
}
