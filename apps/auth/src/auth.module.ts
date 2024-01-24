import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UserPassword,
  UserPasswordSchema,
} from './schemas/user-password.schema';

@Module({
  imports: [
    CommonModule,
    DbModule,
    RedisModule,
    MongooseModule.forFeature([
      {
        name: UserPassword.name,
        schema: UserPasswordSchema,
      },
    ]),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
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
export class AuthModule {}
