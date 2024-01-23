import _ from 'lodash';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { AuthSignUpDto, UserEvent, AuthSignInDto } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { UserPassword } from './schemas/user-password.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserPassword.name)
    private readonly userPasswordModel: Model<UserPassword>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async signUp(payload: AuthSignUpDto) {
    const createdUser = await firstValueFrom(
      this.userServiceClient.send(
        UserEvent.CREATE,
        _.omit(payload, ['password']),
      ),
    );

    await this.userPasswordModel.create({
      user_id: new MongooseSchema.Types.ObjectId(createdUser._id),
      password: payload.password,
    });

    // Sign auth tokens.
  }

  async signIn(payload: AuthSignInDto) {
    const foundUser = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, {
        username: payload.username,
      }),
    );

    if (!foundUser) {
      throw new NotFoundException('User is not found! Please sign up first.');
    }

    // Compare passwords and sign auth tokens.
  }
}
