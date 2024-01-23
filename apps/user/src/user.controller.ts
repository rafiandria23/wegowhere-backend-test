import { Controller, Get } from '@nestjs/common';
import { CommonService } from '@app/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
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
