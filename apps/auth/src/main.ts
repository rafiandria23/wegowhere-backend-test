import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
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
        queue: 'auth',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
