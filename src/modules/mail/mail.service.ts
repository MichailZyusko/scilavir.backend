import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '../users/schema/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserActivationLink({ link, user }: { link: string, user: UserDocument }) {
    await this.mailerService.sendMail({
      to: 'michail.zyusko@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `
      <div>
        <p>Hey <b>${user.firstName} ${user.lastName}</b>,</p>
        <p>
          Welcome to Scilavir
        </p>
        <p>
          For verification press on this <a href="${link}">link</a>!
        </p>
    </div>`,
    });
  }
}
