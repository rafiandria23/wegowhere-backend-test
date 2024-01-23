import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [CommonModule, DbModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
