import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = new this.UserModel(createUserDto);

    return user.save();
  }

  async getUsers() {
    return this.UserModel.find();
  }
}
