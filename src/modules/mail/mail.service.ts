import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { round } from 'src/utils';
import { User } from '@clerk/backend';
import { SCILAVIR_EMAIL } from '../../constants';
import { Cart } from '../cart/entity/cart.entity';

type TOrder = {
  user: User;
  cart: Cart[];
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendNewOrderAlert({ user, cart }: TOrder) {
    await this.mailerService.sendMail({
      to: SCILAVIR_EMAIL,
      subject: 'New order in web app',
      html: `
        <div>
          <p>
            <b>${user.firstName} ${user.lastName}</b> makes a new order:
          </p>
          <div>
            ${cart
          .map(({ quantity, product }) => {
            const ProductTemplate = `
              <p>${product.name} x${quantity}</p>
              <p>Price: ${round(product.price * quantity)} Br</p>
              <img src="${product.images[0]}" width="100" height="100" alt="${product.name}" />
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
