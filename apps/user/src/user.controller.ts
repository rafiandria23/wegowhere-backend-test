import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreateDto, UserEvent, UserFindByUsernameDto } from '@app/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserEvent.CREATE)
  async create(@Payload() payload: UserCreateDto) {
    return await this.userService.create(payload);
  }

  @MessagePattern(UserEvent.FIND_ALL)
  async findAll() {
    return await this.userService.findAll();
  }

  @MessagePattern(UserEvent.FIND_BY_USERNAME)
  async findByUsername(@Payload() payload: UserFindByUsernameDto) {
    return await this.userService.findByUsername(payload.username);
  }

  @MessagePattern(UserEvent.ME)
  async me() {
    return await this.userService.me();
  }
}
