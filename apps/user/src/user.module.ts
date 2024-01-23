import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';

@Module({
  imports: [CommonModule, DbModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
