import { Product } from 'src/modules/products/entity/product.entity';
import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne, Column, JoinColumn,
} from 'typeorm';

@Entity({
  name: 'cart',
})
export class Cart {
  @PrimaryColumn()
  userId: string;

  // ! TODO: made normal schema and relations
  @PrimaryColumn('uuid')
  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  productId: string;

  @Column({ default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
