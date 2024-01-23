import { Controller, Get } from '@nestjs/common';
import { CommonService } from '@app/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(
    private readonly commonService: CommonService,
    private readonly chatService: ChatService,
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
