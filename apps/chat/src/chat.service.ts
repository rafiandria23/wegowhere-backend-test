import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
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
  ) {}

  async createRoom(userId: string, payload: ChatCreateRoomDto) {
    const createdRoom = (
      await this.chatRoomModel.create({
        name: payload.name,
      })
    ).toObject();

    await this.chatMemberModel.create({
      room_id: createdRoom._id,
      user_id: new MongooseSchema.Types.ObjectId(userId),
    });

    return createdRoom;
  }

  async joinRoom(userId: string, payload: ChatJoinRoomDto) {
    const foundRoom = await this.findRoomById(payload.room_id);

    if (!foundRoom) {
      // Refactor this to use RPC exception.
      throw new Error('Chat room is not found! Please create one first.');
    }

    await this.chatMemberModel.create({
      room_id: foundRoom._id,
      user_id: new MongooseSchema.Types.ObjectId(userId),
    });
  }

  async saveMessage(userId: string, payload: ChatSaveMessageDto) {
    const foundRoom = await this.findRoomById(payload.room_id);

    if (!foundRoom) {
      throw new Error('Chat room is not found! Please create one first!');
    }

    await this.chatMessageModel.create({
      room_id: foundRoom._id,
      user_id: new MongooseSchema.Types.ObjectId(userId),
      content: payload.content,
    });
  }

  async findRoomById(id: string) {
    const foundRoom = await this.chatRoomModel.findById(
      new MongooseSchema.Types.ObjectId(id),
    );

    if (!foundRoom) {
      return null;
    }

    return foundRoom.toObject();
  }
}
