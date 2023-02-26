import {
  Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UseGuards,
} from '@nestjs/common';
import { type Response } from 'express';
import { Payload } from '../token/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/schema/user.schema';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(createUserDto);

    res.cookie('a-token', accessToken, { httpOnly: true });
    res.cookie('r-token', refreshToken, { httpOnly: true });

    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() logInDto: SignInDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(logInDto);

    res.cookie('a-token', accessToken, { httpOnly: true });
    res.cookie('r-token', refreshToken, { httpOnly: true });

    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  @Delete('sign-out')
  async signOut(
    @Req() req: Request & { user: UserDocument },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(req.user);

    res.cookie('token', '', { expires: new Date() });
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request & { user: Payload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sub: userId, refreshToken } = req.user;

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens({
      userId,
      checkingRefreshToken: refreshToken,
    });

    res.cookie('a-token', accessToken, { httpOnly: true });
    res.cookie('r-token', newRefreshToken, { httpOnly: true });

    return { accessToken, refreshToken };
  }
}
