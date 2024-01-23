import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DbModule } from '@app/db';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CommonModule, DbModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
