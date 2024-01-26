import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatModule,
    {
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
    },
  );

  await app.listen();
}
bootstrap();
