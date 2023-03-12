/* eslint-disable @typescript-eslint/indent */

import {
  Prop, raw, Schema, SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { TOrder } from '../types';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop(raw([{
    count: Number,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  }]))
  details: [TOrder];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
