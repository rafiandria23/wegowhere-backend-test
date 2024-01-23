import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [CommonModule, DbModule, RedisModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
