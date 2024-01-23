import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { RmqModule } from '@app/rmq';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CommonModule, DbModule, RedisModule, RmqModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
