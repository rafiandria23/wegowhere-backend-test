import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonService } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly commonService: CommonService,
    private readonly authService: AuthService,
  ) {}

  @Get('/')
  home() {
    return this.commonService.successTimestamp();
  }

  @Get('/health')
  health() {
    return this.commonService.successTimestamp();
  }
}
