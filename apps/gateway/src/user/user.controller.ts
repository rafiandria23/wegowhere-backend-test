import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthGuard,
  CommonService,
  UserEvent,
  UserFindByUsernameDto,
} from '@app/common';

@Controller('/api/v1/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Headers('authorization') authorization: string) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload: {},
    });
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_ALL, record),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async findByUsername(
    @Headers('authorization') authorization: string,
    @Param() payload: UserFindByUsernameDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.FIND_BY_USERNAME, record),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async me(@Headers('authorization') authorization: string) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload: {},
    });
    const result = await firstValueFrom(
      this.userServiceClient.send(UserEvent.ME, record),
    );

    return this.commonService.successTimestamp({
      data: result,
    });
  }
}
