import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CommonService } from '@app/common';

@Controller()
export class GatewayController {
  constructor(private readonly commonService: CommonService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  home() {
    return this.commonService.successTimestamp();
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  health() {
    return this.commonService.successTimestamp();
  }
}
