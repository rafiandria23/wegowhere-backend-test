import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';
import {
  ChatCreateRoomDto,
  ChatJoinRoomDto,
  ChatSaveMessageDto,
} from '@app/common';
import { ChatRoom } from './schemas/chat-room.schema';
import { ChatMember } from './schemas/chat-member.schema';
import { ChatMessage } from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatMember.name)
    private readonly chatMemberModel: Model<ChatMember>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async createRoom(user_id: string, payload: ChatCreateRoomDto) {
    const createdRoom = (
      await this.chatRoomModel.create({
        name: payload.name,
      })
    ).toObject();

    await this.chatMemberModel.create({
      room_id: createdRoom._id,
      user_id,
    });

    return createdRoom;
  }

  async joinRoom(user_id: string, payload: ChatJoinRoomDto) {
    const foundRoom = await this.findRoomById(payload.room_id);

    if (!foundRoom) {
      throw new RpcException(
        'Chat room is not found! Please create one first.',
      );
    }

    await this.chatMemberModel.create({
      room_id: foundRoom._id,
      user_id,
    });
  }

  async saveMessage(user_id: string, payload: ChatSaveMessageDto) {
    const foundRoom = await this.findRoomById(payload.room_id);

    if (!foundRoom) {
      throw new RpcException(
        'Chat room is not found! Please create one first!',
      );
    }

    await this.chatMessageModel.create({
      room_id: foundRoom._id,
      user_id,
      content: payload.content,
    });
  }

  async findAllRooms() {
    const foundRooms = await this.chatRoomModel.find({});

    return foundRooms.map((room) => room.toObject());
  }

  async findRoomById(room_id: string) {
    const foundRoom = await this.chatRoomModel.findById(room_id);

    if (!foundRoom) {
      return null;
    }

    return foundRoom.toObject();
  }

  async findAllMembersByRoomId(room_id: string) {
    const foundMembers = await this.chatMemberModel.find({
      room_id,
    });

    return foundMembers.map((member) => member.toObject());
  }

  async findAllMessagesByRoomId(room_id: string) {
    const foundMessages = await this.chatMessageModel.find({
      room_id,
    });

    return foundMessages.map((message) => message.toObject());
  }
}
