import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';
import gatewayConfig from './configs/gateway.config';
import dbConfig from './configs/db.config';
import redisConfig from './configs/redis.config';
import rmqConfig from './configs/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig, dbConfig, redisConfig, rmqConfig],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
