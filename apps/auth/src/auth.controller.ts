import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthEvent, AuthSignUpDto, UserEvent } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @MessagePattern(AuthEvent.SIGN_UP)
  async signUp(@Payload() payload: AuthSignUpDto) {
    return await firstValueFrom(
      this.userServiceClient.send(UserEvent.CREATE, payload),
    );
  }
}
