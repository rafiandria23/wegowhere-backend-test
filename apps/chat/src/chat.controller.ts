import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  ChatSaveMessageDto,
  ChatEvent,
  ChatCreateRoomDto,
  ChatJoinRoomDto,
} from '@app/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern(ChatEvent.CREATE_ROOM)
  async createRoom(@Payload() payload: ChatCreateRoomDto) {
    return await this.chatService.createRoom('aasdasd', payload);
  }

  @MessagePattern(ChatEvent.JOIN_ROOM)
  async joinRoom(@Payload() payload: ChatJoinRoomDto) {
    return await this.chatService.joinRoom('asdasdas', payload);
  }

  @EventPattern(ChatEvent.SAVE_MESSAGE)
  async saveMessage(@Payload() payload: ChatSaveMessageDto) {
    await this.chatService.saveMessage('asdasd', payload);
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
