import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ChatMessage {
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

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  content: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
