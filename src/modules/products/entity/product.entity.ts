import { Feedback } from '@modules/feedbacks/entity/feedback.entity';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  article: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float4')
  price: number;

  @Column('text', { array: true })
  images: string[];

  @OneToMany(() => Feedback, (feedback) => feedback.product)
  feedbacks: Feedback[];

  @Column('uuid', { array: true })
  groupIds: string[];

  @Column('uuid', { array: true })
  categoryIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
