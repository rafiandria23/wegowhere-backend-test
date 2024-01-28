import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { CommonModule, ExceptionFilter } from '@app/common';
import { JwtModule } from '@app/jwt';
import { AuthController } from './auth/auth.controller';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [CommonModule, JwtModule],
  controllers: [
    GatewayController,
    AuthController,
    ChatController,
    UserController,
  ],
  providers: [
    ChatGateway,
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          exceptionFactory(data) {
            return new BadRequestException(data);
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
      provide: 'AUTH_SERVICE',
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
            queue: 'auth',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
    {
      provide: 'CHAT_SERVICE',
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
            queue: 'chat',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
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
export class GatewayModule {}
