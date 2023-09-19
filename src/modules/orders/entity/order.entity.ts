import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column,
} from 'typeorm';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
