import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthEvent,
  AuthSignInDto,
  AuthSignUpDto,
  CommonService,
} from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: AuthSignUpDto) {
    const result = await firstValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_UP, payload),
    );

    return this.commonService.successTimestamp({ data: result });
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() payload: AuthSignInDto) {
    const result = await firstValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_IN, payload),
    );

    return this.commonService.successTimestamp({ data: result });
  }
}
