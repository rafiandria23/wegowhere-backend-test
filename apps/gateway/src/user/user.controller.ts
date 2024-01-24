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
import { CommonService, UserEvent } from '@app/common';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_ALL, {}),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(@Param('username') username: string) {
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, { username }),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async me() {
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.ME, {}),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }
}
