import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { SignInDto } from './dto/sign-in.dto';
import { TokenService } from '../token/token.service';
import { Tokens } from '../token/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    const user = await this.userService.create(createUserDto);

    const tokens = await this.tokenService.generateTokens({
      userId: user._id,
      email: user.email,
    });
    const token = await this.tokenService.save({
      userId: user._id,
      refreshToken: tokens.refreshToken,
    });

    user.token = token;
    await user.save();

    return tokens;
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.findOne({ email });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password or email are incorrect');

    const tokens = await this.tokenService.generateTokens({ userId: user._id, email });
    await this.tokenService.save({
      userId: user._id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signOut({ sub }: { sub: string }) {
    const userObjectId = new Types.ObjectId(sub);

    await this.tokenService.revokeTokens({ userId: userObjectId });
  }

  async refreshTokens({
    userId,
    checkingRefreshToken,
    email,
  }: RefreshDto): Promise<Tokens> {
    const userObjectId = new Types.ObjectId(userId);
    const { refreshToken } = await this.tokenService.getRefreshToken({ userId: userObjectId });

    const refreshTokenMatches = await bcrypt.compare(
      checkingRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('RefreshToken is incorrect. Access Denied');

    const tokens = await this.tokenService.generateTokens({ userId: userObjectId, email });
    await this.tokenService.save({ userId: userObjectId, refreshToken: tokens.refreshToken });

    return tokens;
  }
}
