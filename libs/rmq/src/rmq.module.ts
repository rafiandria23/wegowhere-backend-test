import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: 'asdasd',
          imports: [ConfigModule],
          inject: [ConfigService],
          async useFactory(configService: ConfigService) {
            return {
              transport: Transport.RMQ,
              options: {
                urls: [
                  {
                    hostname: configService.get('rmq.host'),
                    port: configService.get('rmq.port'),
                    username: configService.get('rmq.user'),
                    password: configService.get('rmq.pass'),
                  },
                ],
                noAck: false,
                queue: 'chat',
                queueOptions: {
                  durable: false,
                },
              },
            };
          },
        },
      ],
    }),
  ],
})
export class RmqModule {}
