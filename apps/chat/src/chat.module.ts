import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CommonModule, CommonService, ExceptionFilter } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schema';
import { ChatMember, ChatMemberSchema } from './schemas/chat-member.schema';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';

@Module({
  imports: [
    CommonModule,
    DbModule,
    RedisModule,
    JwtModule,
    MongooseModule.forFeature([
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
      {
        name: ChatMember.name,
        schema: ChatMemberSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: APP_PIPE,
      inject: [CommonService],
      useFactory(commonService: CommonService) {
        return new ValidationPipe({
          exceptionFactory(data) {
            return commonService.createRpcException({
              status: HttpStatus.BAD_REQUEST,
              data,
            });
          },
          validationError: {
            value: false,
            target: false,
          },
        });
      },
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: 'USER_SERVICE',
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              {
                hostname: configService.get<string>('rmq.host'),
                port: configService.get<number>('rmq.port'),
                username: configService.get<string>('rmq.user'),
                password: configService.get<string>('rmq.pass'),
              },
            ],
            queue: 'user',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class ChatModule {}
