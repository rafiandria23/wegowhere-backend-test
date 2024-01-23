import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { CommonModule } from '@app/common';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [CommonModule],
  controllers: [GatewayController, AuthController],
  providers: [
    GatewayService,
    {
      provide: 'AUTH_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
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
  ],
})
export class GatewayModule {}
