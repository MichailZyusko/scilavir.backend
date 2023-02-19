import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { Token, TokenSchema } from './schema/token.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule { }
