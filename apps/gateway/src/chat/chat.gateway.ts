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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatSaveMessageDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization: _.get(client, 'handshake.headers.authorization'),
      payload,
    });
    this.chatServiceClient.emit(ChatEvent.SAVE_MESSAGE, record);

    return {
      event: ChatSocketEvent.RECEIVE_MESSAGE,
      data: payload,
    };
  }
}
