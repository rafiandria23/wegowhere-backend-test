import { UserEvent } from '@app/common';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_ALL, {}),
    );
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(@Param('id') username: string) {
    return await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, { username }),
    );
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async me() {
    return await firstValueFrom(this.userServiceClient.send(UserEvent.ME, {}));
  }
}
