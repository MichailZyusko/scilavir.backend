import { Product } from 'src/modules/products/entity/product.entity';
import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne, Column, JoinColumn,
} from 'typeorm';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryColumn()
  userId: string;

  // ! TODO: made normal schema and relations
  @PrimaryColumn({ select: false })
  productId: string;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column({ default: 0, unsigned: true })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
