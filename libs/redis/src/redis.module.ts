import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'ioredis';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync<RedisOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          store: redisStore,
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.pass'),
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
