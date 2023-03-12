import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SCILAVIR_EMAIL } from 'src/constants';
import { UserDocument } from '../users/schema/user.schema';
import { OrderDocument } from '../orders/schema/order.shema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserActivationLink({ link, user }: { link: string, user: UserDocument }) {
    await this.mailerService.sendMail({
      to: user.email,
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
        </div>
      `,
    });
  }

  async sendNewOrderAlert({ order }: { order: OrderDocument }) {
    await this.mailerService.sendMail({
      to: SCILAVIR_EMAIL,
      subject: 'New order in web app',
      html: `
        <div>
          <p>
            <b>${order.user.firstName} ${order.user.lastName}</b> make a new order:
          </p>
          <div>
            ${order.goods
          .map((good) => {
            const goodTemplate = `<p>${good.goods.name} x${good.count}</p>`;

            return goodTemplate;
          })
          .join(', \n')
        }
          </div>
        </div>
      `,
    });
  }
}
