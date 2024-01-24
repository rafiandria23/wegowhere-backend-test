import { Controller, UseGuards } from '@nestjs/common';
import {
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
} from '@app/common';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern(ChatEvent.CREATE_ROOM)
  async createRoom(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatCreateRoomDto,
  ) {
    return await this.chatService.createRoom(
      ctx.getMessage().auth.user_id,
      payload,
    );
  }

  @MessagePattern(ChatEvent.JOIN_ROOM)
  async joinRoom(@Ctx() ctx: RmqContext, @Payload() payload: ChatJoinRoomDto) {
    return await this.chatService.joinRoom(
      ctx.getMessage().auth.user_id,
      payload,
    );
  }

  @EventPattern(ChatEvent.SAVE_MESSAGE)
  async saveMessage(
    @Ctx() ctx: RmqContext,
    @Payload() payload: ChatSaveMessageDto,
  ) {
    await this.chatService.saveMessage(ctx.getMessage().auth.user_id, payload);
  }

  @MessagePattern(ChatEvent.FIND_ALL_ROOMS)
  async findAllRooms() {
    return await this.chatService.findAllRooms();
  }

  @MessagePattern(ChatEvent.FIND_ROOM_BY_ID)
  async findRoomById(@Payload('room_id') room_id: string) {
    return await this.chatService.findRoomById(room_id);
  }

  @MessagePattern(ChatEvent.FIND_ALL_MEMBERS_BY_ROOM_ID)
  async findAllMembersByRoomId(@Payload('room_id') room_id: string) {
    return await this.chatService.findAllMembersByRoomId(room_id);
  }

  @MessagePattern(ChatEvent.FIND_ALL_MESSAGES_BY_ROOM_ID)
  async findAllMessagesByRoomId(@Payload('room_id') room_id: string) {
    return await this.chatService.findAllMessagesByRoomId(room_id);
  }
}
