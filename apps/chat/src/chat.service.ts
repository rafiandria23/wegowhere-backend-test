import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatCreateRoomDto,
  ChatFindAllMembersByRoomIdDto,
  ChatFindAllMessagesByRoomIdDto,
  ChatFindRoomByIdDto,
  ChatJoinRoomDto,
  ChatSaveMessageDto,
  CommonService,
} from '@app/common';
import { ChatRoom } from './schemas/chat-room.schema';
import { ChatMember } from './schemas/chat-member.schema';
import { ChatMessage } from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly commonService: CommonService,
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatMember.name)
    private readonly chatMemberModel: Model<ChatMember>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  async createRoom({
    user_id,
    payload,
  }: {
    user_id: string;
    payload: ChatCreateRoomDto;
  }) {
    const createdRoom = await this.chatRoomModel.create({
      name: payload.name,
    });

    await this.chatMemberModel.create({
      room_id: createdRoom._id,
      user_id,
    });

    return createdRoom.toObject();
  }

  async joinRoom({
    user_id,
    payload,
  }: {
    user_id: string;
    payload: ChatJoinRoomDto;
  }) {
    const foundRoom = await this.findRoomById({
      room_id: payload.room_id,
    });

    if (!foundRoom) {
      throw this.commonService.createRpcException({
        status: HttpStatus.NOT_FOUND,
        data: 'Chat room is not found! Please create one first.',
      });
    }

    await this.chatMemberModel.create({
      room_id: foundRoom._id,
      user_id,
    });
  }

  async saveMessage({
    user_id,
    payload,
  }: {
    user_id: string;
    payload: ChatSaveMessageDto;
  }) {
    const foundRoom = await this.findRoomById({
      room_id: payload.room_id,
    });

    if (!foundRoom) {
      throw this.commonService.createRpcException({
        status: HttpStatus.NOT_FOUND,
        data: 'Chat room is not found! Please create one first.',
      });
    }

    const savedMessage = await this.chatMessageModel.create({
      room_id: foundRoom._id,
      user_id,
      content: payload.content,
    });

    return savedMessage.toObject();
  }

  async findAllRooms() {
    const foundRooms = await this.chatRoomModel.find({});

    return foundRooms.map((room) => room.toObject());
  }

  async findRoomById(payload: ChatFindRoomByIdDto) {
    const foundRoom = await this.chatRoomModel.findById(payload.room_id);

    if (!foundRoom) {
      return null;
    }

    return foundRoom.toObject();
  }

  async findAllMembersByRoomId(payload: ChatFindAllMembersByRoomIdDto) {
    const foundMembers = await this.chatMemberModel.find({
      room_id: payload.room_id,
    });

    return foundMembers.map((member) => member.toObject());
  }

  async findAllMessagesByRoomId(payload: ChatFindAllMessagesByRoomIdDto) {
    const foundMessages = await this.chatMessageModel.find({
      room_id: payload.room_id,
    });

    return foundMessages.map((message) => message.toObject());
  }
}
