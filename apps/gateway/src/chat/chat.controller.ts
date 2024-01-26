import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  AuthGuard,
  ChatCreateRoomDto,
  ChatEvent,
  ChatFindAllMembersByRoomIdDto,
  ChatFindAllMessagesByRoomIdDto,
  ChatFindRoomByIdDto,
  ChatJoinRoomDto,
  CommonService,
} from '@app/common';

@Controller('/api/v1/chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly commonService: CommonService,
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  @Post('/rooms')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Headers('authorization') authorization: string,
    @Body() payload: ChatCreateRoomDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });

    const createdRoom = await lastValueFrom(
      this.chatServiceClient.send(ChatEvent.CREATE_ROOM, record),
    );

    return this.commonService.successTimestamp({
      data: createdRoom,
    });
  }

  @Post('/rooms/join')
  @HttpCode(HttpStatus.CREATED)
  async joinRoom(
    @Headers('authorization') authorization: string,
    @Body() payload: ChatJoinRoomDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });

    this.chatServiceClient.emit(ChatEvent.JOIN_ROOM, record);

    return this.commonService.successTimestamp();
  }

  @Get('/rooms')
  @HttpCode(HttpStatus.OK)
  async findAllRooms(@Headers('authorization') authorization: string) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload: {},
    });

    const foundRooms = await lastValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ALL_ROOMS, record),
    );

    return this.commonService.successTimestamp({ data: foundRooms });
  }

  @Get('/rooms/:room_id')
  @HttpCode(HttpStatus.OK)
  async findRoomById(
    @Headers('authorization') authorization: string,
    @Param() payload: ChatFindRoomByIdDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });

    const foundRoom = await lastValueFrom(
      this.chatServiceClient.send(ChatEvent.FIND_ROOM_BY_ID, record),
    );

    return this.commonService.successTimestamp({ data: foundRoom });
  }

  @Get('/rooms/:room_id/members')
  @HttpCode(HttpStatus.OK)
  async findAllMembersByRoomId(
    @Headers('authorization') authorization: string,
    @Param() payload: ChatFindAllMembersByRoomIdDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });

    const foundMembers = await lastValueFrom(
      this.chatServiceClient.send(
        ChatEvent.FIND_ALL_MEMBERS_BY_ROOM_ID,
        record,
      ),
    );

    return this.commonService.successTimestamp({ data: foundMembers });
  }

  @Get('/rooms/:room_id/messages')
  @HttpCode(HttpStatus.OK)
  async findAllMessagesByRoomId(
    @Headers('authorization') authorization: string,
    @Param() payload: ChatFindAllMessagesByRoomIdDto,
  ) {
    const record = this.commonService.buildRmqRecord({
      authorization,
      payload,
    });

    const foundMessages = await lastValueFrom(
      this.chatServiceClient.send(
        ChatEvent.FIND_ALL_MESSAGES_BY_ROOM_ID,
        record,
      ),
    );

    return this.commonService.successTimestamp({ data: foundMessages });
  }
}
