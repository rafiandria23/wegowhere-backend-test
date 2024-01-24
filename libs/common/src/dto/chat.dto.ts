import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class ChatCreateRoomDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class ChatJoinRoomDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly room_id: string;
}

export class ChatSaveMessageDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly room_id: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
