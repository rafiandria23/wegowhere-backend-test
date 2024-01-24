import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatEvent, ChatSaveMessageDto, ChatSocketEvent } from '@app/common';
import { AuthWsGuard } from '@app/common/guards/ws.guard';

@WebSocketGateway()
@UseGuards(AuthWsGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  @SubscribeMessage(ChatSocketEvent.SEND_MESSAGE)
  handleMessage(@MessageBody() payload: ChatSaveMessageDto) {
    // Emit chat message to related connected clients.
    this.server.emit(ChatSocketEvent.RECEIVE_MESSAGE, payload);

    // Save chat message asynchronously.
    this.chatServiceClient.emit(ChatEvent.SAVE_MESSAGE, payload);
  }
}
