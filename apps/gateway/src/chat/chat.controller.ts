import {
  AuthHttpGuard,
  ChatCreateRoomDto,
  ChatEvent,
  ChatJoinRoomDto,
  CommonService,
} from '@app/common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/v1/chat')
@UseGuards(AuthHttpGuard)
export class ChatController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  @Post('/rooms')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(@Body() payload: ChatCreateRoomDto) {
    const createdRoom = await firstValueFrom(
      this.chatServiceClient.emit(ChatEvent.CREATE_ROOM, payload),
    );

    return this.commonService.successTimestamp({
      data: createdRoom,
    });
  }

  @Post('/rooms/join')
  @HttpCode(HttpStatus.CREATED)
  async joinRoom(@Body() payload: ChatJoinRoomDto) {
    this.chatServiceClient.emit(ChatEvent.JOIN_ROOM, payload);

    return this.commonService.successTimestamp();
  }

  @Get('/rooms')
  @HttpCode(HttpStatus.OK)
  async findAllRooms() {
    const foundRooms = await firstValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ALL_ROOMS, {}),
    );

    return this.commonService.successTimestamp({ data: foundRooms });
  }

  @Get('/rooms/:room_id')
  @HttpCode(HttpStatus.OK)
  async findRoomById(@Param('id') room_id: string) {
    const foundRoom = await firstValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ROOM_BY_ID, { room_id }),
    );

    return this.commonService.successTimestamp({ data: foundRoom });
  }

  @Get('/rooms/:room_id/members')
  @HttpCode(HttpStatus.OK)
  async findAllMembersByRoomId(@Param('id') room_id: string) {
    const foundMembers = await firstValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ALL_MEMBERS_BY_ROOM_ID, {
        room_id,
      }),
    );

    return this.commonService.successTimestamp({ data: foundMembers });
  }

  @Get('/rooms/:room_id/messages')
  @HttpCode(HttpStatus.OK)
  async findAllMessagesByRoomId(@Param('id') room_id: string) {
    const foundMessages = await firstValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ALL_MESSAGES_BY_ROOM_ID, {
        room_id,
      }),
    );

    return this.commonService.successTimestamp({ data: foundMessages });
  }
}
