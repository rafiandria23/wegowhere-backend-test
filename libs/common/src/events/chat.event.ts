export enum ChatEvent {
  CREATE_ROOM = 'chat.room.create',
  JOIN_ROOM = 'chat.room.join',
  SAVE_MESSAGE = 'chat.message.save',
}

export enum ChatSocketEvent {
  SEND_MESSAGE = 'chat.message.send',
  RECEIVE_MESSAGE = 'chat.message.receive',
}
