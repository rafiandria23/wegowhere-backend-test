import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthGuard,
  Public,
  UserCreateDto,
  UserEvent,
  UserFindByIdDto,
  UserFindByUsernameDto,
} from '@app/common';
import { RedisService } from '@app/redis';
import { UserService } from './user.service';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @MessagePattern(UserEvent.CREATE)
  async create(@Payload() payload: UserCreateDto) {
    const result = await this.userService.create(payload);

    await this.redisService.set({
      key: `user.${result._id.toString()}`,
      payload: result,
    });

    return result;
  }

  @MessagePattern(UserEvent.FIND_ALL)
  async findAll() {
    return await this.userService.findAll();
  }

  @MessagePattern(UserEvent.FIND_BY_ID)
  async findById(@Payload() payload: UserFindByIdDto) {
    const result = await this.redisService.cacheResult({
      key: `user.${payload.user_id}`,
      handler: {
        args: payload,
        fn: this.userService.findById,
      },
    });

    return result;
  }

  @Public()
  @MessagePattern(UserEvent.FIND_BY_USERNAME)
  async findByUsername(@Payload() payload: UserFindByUsernameDto) {
    const result = await this.userService.findByUsername(payload);

    await this.redisService.set({
      key: `user.${result._id.toString()}`,
      payload: result,
    });

    return result;
  }
}
