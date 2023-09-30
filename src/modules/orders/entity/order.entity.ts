import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
