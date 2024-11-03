import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { round } from '@utils/index';
import { User } from '@clerk/backend';
import { SCILAVIR_EMAIL } from '@constants/index';
import { Product } from '@modules/products/entity/product.entity';
import { TOrderDetails } from '@modules/orders/types';


type CartItem = Pick<Product, 'id' | 'images' | 'name' | 'price'> & { quantity: number };

type TOrder = {
  user: User;
  cart: CartItem[];
  orderDetails: TOrderDetails;
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendNewOrderAlert({ user, cart, orderDetails }: TOrder) {
    const userImage = user?.imageUrl;

    await this.mailerService.sendMail({
      to: SCILAVIR_EMAIL,
      subject: 'New order in web app',
      html: `
      <div>
        <p>
          <img src="${userImage}" width="100" height="100" alt="User image" style="float: right;" />
          <br />
          <p>Order details:</p>
          <pre>
${JSON.stringify(orderDetails, null, 2).trim()}
          </pre>
        </p>
        <div style="float: left;">
          ${cart
          .map((product) => {
            const { quantity } = product;
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
        <div style="clear: both; margin-top: 20px;">
          <p>Order Summary:</p>
          <p>Total Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p>Total Price: ${round(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))} Br</p>
        </div>
      </div>
      `,
    });
  }
}
