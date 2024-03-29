import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CommonService, Public } from '@app/common';

@Controller('/')
@UseGuards(AuthGuard)
export class GatewayController {
  constructor(private readonly commonService: CommonService) {}

  @Public()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  home() {
    return this.commonService.successTimestamp();
  }

  @Public()
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  health() {
    return this.commonService.successTimestamp();
  }
}
