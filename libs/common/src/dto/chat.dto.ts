import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class ChatCreateRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class ChatJoinRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly room_id: string;
}

export class ChatSaveMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly room_id: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
