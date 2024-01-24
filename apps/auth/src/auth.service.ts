import _ from 'lodash';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import bcrypt from 'bcrypt';
import {
  AuthSignUpDto,
  UserEvent,
  AuthSignInDto,
  CommonService,
} from '@app/common';
import { JwtService } from '@app/jwt';
import { UserPassword } from './schemas/user-password.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    @InjectModel(UserPassword.name)
    private readonly userPasswordModel: Model<UserPassword>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async signUp(payload: AuthSignUpDto) {
    const foundUser = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, {
        username: payload.username,
      }),
    );

    if (foundUser) {
      throw new RpcException(
        'User with that username already signed up! Please sign in if it is yours.',
      );
    }

    const createdUser = await firstValueFrom(
      this.userServiceClient.send(
        UserEvent.CREATE,
        _.omit(payload, ['password']),
      ),
    );

    await this.userPasswordModel.create({
      user_id: createdUser._id,
      password: payload.password,
    });

    const tokenPayload = {
      user_id: createdUser._id,
      username: createdUser.username,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(tokenPayload, { expiresIn: '7d' }),
      this.jwtService.sign(tokenPayload, { expiresIn: '30d' }),
    ]);

    return this.commonService.successTimestamp({
      data: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  }

  async signIn(payload: AuthSignInDto) {
    const foundUser = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, {
        username: payload.username,
      }),
    );

    if (!foundUser) {
      throw new RpcException('User is not found! Please sign up first.');
    }

    const foundUserPassword = await this.userPasswordModel.findOne({
      user_id: foundUser._id,
    });

    if (!foundUserPassword) {
      throw new RpcException(
        'Oops! It is from our end, please reset your password.',
      );
    }

    if (!(await bcrypt.compare(payload.password, foundUserPassword.password))) {
      throw new RpcException('Username or password is wrong!');
    }

    const tokenPayload = {
      user_id: foundUser._id,
      username: foundUser.username,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(tokenPayload, { expiresIn: '7d' }),
      this.jwtService.sign(tokenPayload, { expiresIn: '30d' }),
    ]);

    return this.commonService.successTimestamp({
      data: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  }
}
