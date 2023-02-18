import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation() {
    await this.mailerService.sendMail({
      to: 'michail.zyusko@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      text: 'Hello world',
    });
  }
}
