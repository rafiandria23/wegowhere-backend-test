export enum ChatEvent {
  CREATE_ROOM = 'chat.room.create',
  JOIN_ROOM = 'chat.room.join',
  SAVE_MESSAGE = 'chat.message.save',
  FIND_ALL_ROOMS = 'chat.room.find_all',
  FIND_ROOM_BY_ID = 'chat.room.find_by_id',
  FIND_ALL_MEMBERS_BY_ROOM_ID = 'chat.room.member.find_all',
  FIND_ALL_MESSAGES_BY_ROOM_ID = 'chat.room.message.find_all',
}

export enum ChatSocketEvent {
  SEND_MESSAGE = 'chat.message.send',
  RECEIVE_MESSAGE = 'chat.message.receive',
}
