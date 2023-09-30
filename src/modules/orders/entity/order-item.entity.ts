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

  @Column({ default: 0, unsigned: true })
  quantity: number;

  @Column('float', { default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
