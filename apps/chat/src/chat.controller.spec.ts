import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let chatController: ChatController;

  beforeEach(async () => {
    const chat: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    }).compile();

    chatController = chat.get<ChatController>(ChatController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatController.health()).toBe('Hello World!');
    });
  });
});
