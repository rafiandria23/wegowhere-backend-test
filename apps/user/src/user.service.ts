import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserCreateDto,
  UserFindByIdDto,
  UserFindByUsernameDto,
} from '@app/common';
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

  async findAll() {
    const foundUsers = await this.userModel.find({});

    return foundUsers.map((user) => user.toObject());
  }

  findById = async (payload: UserFindByIdDto) => {
    const foundUser = await this.userModel.findById(payload.user_id);

    if (!foundUser) {
      return null;
    }

    return foundUser.toObject();
  };

  async findByUsername(payload: UserFindByUsernameDto) {
    const foundUser = await this.userModel.findOne({
      username: payload.username,
    });

    if (!foundUser) {
      return null;
    }

    return foundUser.toObject();
  }

  me = async () => {
    return {};
  };
}
