import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { round } from 'src/utils';
import { SCILAVIR_EMAIL } from '../../constants';

type TOrder = {
  user: {
    firstName: string;
    lastName: string;
  }
  details: [{
    quantity: number;
    products: {
      name: string;
      price: number;
      images: string[];
    }
  }]
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendNewOrderAlert({ order }: { order: TOrder }) {
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
          .map(({ quantity, products }) => {
            const ProductTemplate = `
              <p>${products.name} x${quantity}</p>
              <p>Price: ${round(products.price * quantity)} Br</p>
              <img src="${products.images[0]}" width="100" height="100" alt="${products.name}" />
            `;

            return ProductTemplate;
          })
          .join('<br />')
        }
          </div>
        </div>
      `,
    });
  }
}
