import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthEvent,
  AuthGuard,
  AuthSignInDto,
  AuthSignUpDto,
  Public,
} from '@app/common';
import { AuthService } from './auth.service';

@Controller()
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @MessagePattern(AuthEvent.SIGN_UP)
  async signUp(@Payload() payload: AuthSignUpDto) {
    return await this.authService.signUp(payload);
  }

  @Public()
  @MessagePattern(AuthEvent.SIGN_IN)
  async signIn(@Payload() payload: AuthSignInDto) {
    return await this.authService.signIn(payload);
  }
}
