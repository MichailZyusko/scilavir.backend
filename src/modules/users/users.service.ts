import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const isExistUserWithSameEmail = await this.UserModel.findOne({ email });
    if (isExistUserWithSameEmail) {
      throw new Error(`User w/ email: ${email} already exist`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.UserModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await user.save();

    const webAppLink = this.configService.getOrThrow<string>('WEB_APP_LINK');
    const activationLink = `${webAppLink}/${user._id}`;

    await this.mailService.sendUserActivationLink({
      link: activationLink,
      user,
    });

    return user;
  }

  async getUsers() {
    return this.UserModel.find();
  }
}
