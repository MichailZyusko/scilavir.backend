/* eslint-disable @typescript-eslint/indent */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../enums/users.enums';
import { Token } from '../../token/schema/token.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({
    type: String, enum: Role, required: true, default: Role.user,
  })
  role: Role;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
  token: Token;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
