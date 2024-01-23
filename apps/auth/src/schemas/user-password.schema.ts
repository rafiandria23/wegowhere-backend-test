import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { hash } from 'bcrypt';

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
  user_id: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.Date,
    required: true,
  })
  created_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    required: true,
  })
  updated_at: Date;
}

export const UserPasswordSchema = SchemaFactory.createForClass(UserPassword);

UserPasswordSchema.pre('save', async function (this, next) {
  if (this.password) {
    this.password = await hash(this.password, 10);
  }

  return next();
});
