import _ from 'lodash';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { first } from 'rxjs';
import {
  AuthGuard,
  ChatEvent,
  ChatSaveMessageDto,
  ChatSocketEvent,
  CommonService,
} from '@app/common';

@WebSocketGateway()
@UseGuards(AuthGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly commonService: CommonService,
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  @SubscribeMessage(ChatSocketEvent.SEND_MESSAGE)
  saveMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatSaveMessageDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization: _.get(client, 'handshake.headers.authorization'),
      payload,
    });

    this.chatServiceClient
      .send(ChatEvent.SAVE_MESSAGE, record)
      .pipe(first())
      .subscribe((savedMessage) => {
        this.server.emit(ChatSocketEvent.RECEIVE_MESSAGE, savedMessage);
      });
  }
}
