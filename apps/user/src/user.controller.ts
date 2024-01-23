import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreateDto, UserEvent } from '@app/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserEvent.CREATE)
  async create(@Payload() payload: UserCreateDto) {
    return await this.userService.create(payload);
  }
}
