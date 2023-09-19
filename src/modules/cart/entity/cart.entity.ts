import { Product } from 'src/modules/products/entity/product.entity';
import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne, Column,
} from 'typeorm';

@Entity({
  name: 'cart',
})
export class Cart {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn('uuid')
  @OneToOne(() => Product)
  productId: string;

  @Column({ default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
