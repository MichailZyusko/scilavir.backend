import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTokenDto } from './dto/create-token.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { Tokens } from './types';
import { Token, TokenDocument } from './schema/token.schema';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async generateTokens({ userId, email }: GenerateTokenDto): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '7m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async save({ userId, refreshToken }: CreateTokenDto): Promise<TokenDocument> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new Error(`User w/ id: ${userId} doesn't exist`);
    }

    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    const token = await this.TokenModel.findByIdAndUpdate(
      userId,
      { refreshToken: hashedRefreshToken },
      { upsert: true, new: true },
    );

    return token;
  }

  async getRefreshToken({ userId }: { userId: Types.ObjectId }) {
    const { token: { refreshToken } } = await this.UserModel
      .findById(userId)
      .populate('token');
    if (!refreshToken) {
      throw new Error(`User w/ id: ${userId} doesn't exist`);
    }

    return { refreshToken };
  }

  async revokeTokens({ userId }: { userId: Types.ObjectId }) {
    const { token: { refreshToken } } = await this.UserModel
      .findById(userId)
      .populate('token');
    if (!refreshToken) {
      throw new Error(`Refresh token for user w/ id: ${userId} doesn't exist`);
    }

    await this.TokenModel.findByIdAndUpdate(
      userId,
      { refreshToken: null },
      { upsert: true, new: true },
    );
  }
}
