import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column,
} from 'typeorm';

@Entity({
  name: 'order_items',
})
export class OrderItem {
  @PrimaryColumn('uuid')
  productId: string;

  @PrimaryColumn('uuid')
  orderId: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
