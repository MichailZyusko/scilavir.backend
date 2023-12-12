import { Product } from '@modules/products/entity/product.entity';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from 'typeorm';

@Entity({
  name: 'feedbacks',
})
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Product, (product) => product.feedbacks)
  product: Product;

  @Column('uuid')
  productId: string;

  @Column('text')
  userId: string;

  @Column('int2')
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
