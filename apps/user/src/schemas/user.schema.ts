import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  first_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
    default: null,
  })
  last_name: string | null;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
