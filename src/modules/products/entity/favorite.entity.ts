import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({
  name: 'favorites',
})
export class Favorite {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn('uuid')
  @OneToOne(() => Product)
  productId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
