import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserPasswordDocument = HydratedDocument<UserPassword>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class UserPassword {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    unique: true,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  password: string;
}

export const UserPasswordSchema = SchemaFactory.createForClass(UserPassword);

UserPasswordSchema.pre('save', async function (this, next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  return next();
});
