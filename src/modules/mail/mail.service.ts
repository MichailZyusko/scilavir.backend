import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { round } from '@utils/index';
import { User } from '@clerk/backend';
import { SCILAVIR_EMAIL } from '@constants/index';
import { Product } from '@modules/products/entity/product.entity';

type CartItem = Pick<Product, 'id' | 'images' | 'name' | 'price'> & { quantity: number };

type TOrder = {
  user: User;
  cart: CartItem[];
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  private userDTO(user: User) {
    return {
      email: user?.emailAddresses?.[0]?.emailAddress,
      phone: user?.phoneNumbers?.[0]?.phoneNumber,
      image: user?.imageUrl,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }

  async sendNewOrderAlert({ user, cart }: TOrder) {
    const { image, ...userDto } = this.userDTO(user);
    await this.mailerService.sendMail({
      to: SCILAVIR_EMAIL,
      subject: 'New order in web app',
      html: `
        <div>
          <p>
            <img src="${image}" width="100" height="100" alt="User image" style="float: right;" />
            <pre>
${JSON.stringify(userDto, null, 2).trim()}
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
        </div>
      `,
    });
  }
}
