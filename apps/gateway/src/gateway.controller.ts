import { Controller, Get } from '@nestjs/common';
import { CommonService } from '@app/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(
    private readonly commonService: CommonService,
    private readonly gatewayService: GatewayService,
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
