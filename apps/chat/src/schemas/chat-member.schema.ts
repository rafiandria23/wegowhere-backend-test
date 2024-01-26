import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatMemberDocument = HydratedDocument<ChatMember>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ChatMember {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  room_id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  user_id: MongooseSchema.Types.ObjectId;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);
