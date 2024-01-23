import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto } from '@app/common';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(payload: UserCreateDto) {
    const createdUser = await this.userModel.create({
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
    });

    return createdUser.toObject();
  }

  async findByUsername(username: string) {
    const foundUser = await this.userModel.findOne({ username });

    if (!foundUser) {
      return null;
    }

    return foundUser.toObject();
  }
}
