import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: 'gmail',
          auth: {
            user: process.env?.MAIL_USER,
            pass: process.env?.MAIL_PASS,
          },
        },
        defaults: {
          from: '<scilavir.no.reply@gmail.com>',
        },
      }),

    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
