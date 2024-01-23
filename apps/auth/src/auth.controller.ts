import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthEvent, AuthSignInDto, AuthSignUpDto } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthEvent.SIGN_UP)
  async signUp(@Payload() payload: AuthSignUpDto) {
    return await this.authService.signUp(payload);
  }

  @MessagePattern(AuthEvent.SIGN_IN)
  async signIn(@Payload() payload: AuthSignInDto) {
    return await this.authService.signIn(payload);
  }
}
