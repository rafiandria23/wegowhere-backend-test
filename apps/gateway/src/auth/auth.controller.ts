import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthEvent,
  AuthGuard,
  AuthSignInDto,
  AuthSignUpDto,
  CommonService,
  Public,
} from '@app/common';
import { lastValueFrom } from 'rxjs';

@Controller('/api/v1/auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: AuthSignUpDto) {
    const result = await lastValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_UP, payload),
    );

    return this.commonService.successTimestamp({ data: result });
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() payload: AuthSignInDto) {
    const result = await lastValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_IN, payload),
    );

    return this.commonService.successTimestamp({ data: result });
  }
}
