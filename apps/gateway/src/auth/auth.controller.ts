import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthEvent, AuthSignInDto, AuthSignUpDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() payload: AuthSignUpDto) {
    return firstValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_UP, payload),
    );
  }

  @Post('/sign-in')
  async signIn(@Body() payload: AuthSignInDto) {
    return firstValueFrom(
      this.authServiceClient.send(AuthEvent.SIGN_IN, payload),
    );
  }
}
