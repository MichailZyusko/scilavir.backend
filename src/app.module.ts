import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './modules/mail/mail.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
