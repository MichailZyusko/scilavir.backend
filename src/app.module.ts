import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { GoodsModule } from './modules/goods/goods.module';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    MongooseModule.forRoot(process.env?.MONGO_DB_URL),
    MailModule,
    UsersModule,
    TokenModule,
    AuthModule,
    GoodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
