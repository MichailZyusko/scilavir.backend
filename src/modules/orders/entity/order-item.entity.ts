import { Product } from '@modules/products/entity/product.entity';
import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column, JoinColumn, OneToOne,
} from 'typeorm';

@Entity({
  name: 'order_items',
})
export class OrderItem {
  @PrimaryColumn('uuid')
  productId: string;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @PrimaryColumn('uuid')
  orderId: string;

  @Column({ default: 0, unsigned: true })
  quantity: number;

  @Column('float', { default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
