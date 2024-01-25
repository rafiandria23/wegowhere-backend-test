import _ from 'lodash';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ChatSaveMessageDto,
  ChatEvent,
  ChatCreateRoomDto,
  ChatJoinRoomDto,
  AuthGuard,
  ChatFindRoomByIdDto,
  ChatFindAllMembersByRoomIdDto,
  ChatFindAllMessagesByRoomIdDto,
  CommonService,
  UserEvent,
} from '@app/common';
import { ChatService } from './chat.service';
import { firstValueFrom } from 'rxjs';

@Controller()
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly commonService: CommonService,
    private readonly chatService: ChatService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @MessagePattern(ChatEvent.CREATE_ROOM)
  async createRoom(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatCreateRoomDto,
  ) {
    const result = await this.chatService.createRoom({
      user_id: _.get(ctx.getMessage(), 'auth.user_id'),
      payload,
    });

    return result;
  }

  @MessagePattern(ChatEvent.JOIN_ROOM)
  async joinRoom(@Ctx() ctx: RmqContext, @Payload() payload: ChatJoinRoomDto) {
    await this.chatService.joinRoom({
      user_id: _.get(ctx.getMessage(), 'auth.user_id'),
      payload,
    });
  }

  @EventPattern(ChatEvent.SAVE_MESSAGE)
  async saveMessage(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatSaveMessageDto,
  ) {
    await this.chatService.saveMessage({
      user_id: _.get(ctx.getMessage(), 'auth.user_id'),
      payload,
    });
  }

  @MessagePattern(ChatEvent.FIND_ALL_ROOMS)
  async findAllRooms() {
    const result = await this.chatService.findAllRooms();

    return result;
  }

  @MessagePattern(ChatEvent.FIND_ROOM_BY_ID)
  async findRoomById(@Payload() payload: ChatFindRoomByIdDto) {
    const result = await this.chatService.findRoomById(payload);

    return result;
  }

  @MessagePattern(ChatEvent.FIND_ALL_MEMBERS_BY_ROOM_ID)
  async findAllMembersByRoomId(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatFindAllMembersByRoomIdDto,
  ) {
    const members = await this.chatService.findAllMembersByRoomId(payload);

    const result = await Promise.all(
      members.map(async (member) => {
        const user = await firstValueFrom(
          this.userServiceClient.send(
            UserEvent.FIND_BY_ID,
            this.commonService.buildRmqRecord({
              authorization: _.get(
                ctx.getMessage(),
                'properties.headers.authorization',
              ),
              payload: {
                user_id: member.user_id,
              },
            }),
          ),
        );

        return {
          ...member,
          user,
        };
      }),
    );

    return result;
  }

  @MessagePattern(ChatEvent.FIND_ALL_MESSAGES_BY_ROOM_ID)
  async findAllMessagesByRoomId(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatFindAllMessagesByRoomIdDto,
  ) {
    const messages = await this.chatService.findAllMessagesByRoomId(payload);

    const result = await Promise.all(
      messages.map(async (message) => {
        const user = await firstValueFrom(
          this.userServiceClient.send(
            UserEvent.FIND_BY_ID,
            this.commonService.buildRmqRecord({
              authorization: _.get(
                ctx.getMessage(),
                'properties.headers.authorization',
              ),
              payload: {
                user_id: message.user_id,
              },
            }),
          ),
        );

        return {
          ...message,
          user,
        };
      }),
    );

    return result;
  }
}
