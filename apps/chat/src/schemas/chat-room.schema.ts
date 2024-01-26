import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ChatRoom {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
