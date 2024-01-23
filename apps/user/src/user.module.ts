import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule, DbModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
