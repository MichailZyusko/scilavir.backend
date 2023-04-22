import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SCILAVIR_EMAIL } from 'src/constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendNewOrderAlert({ order }: { order: any }) {
    console.log('🚀 ~ file: mail.service.ts:30 ~ MailService ~ sendNewOrderAlert ~ order:', order);

    await this.mailerService.sendMail({
      to: SCILAVIR_EMAIL,
      subject: 'New order in web app',
      html: `
        <div>
          <p>
            <b>${order.user.firstName} ${order.user.lastName}</b> make a new order:
          </p>
          <div>
            ${order.details
          .map(({ count, product }) => {
            const ProductTemplate = `<p>${product.name} x${count}</p>`;

            return ProductTemplate;
          })
          .join(', \n')
        }
          </div>
        </div>
      `,
    });
  }
}
