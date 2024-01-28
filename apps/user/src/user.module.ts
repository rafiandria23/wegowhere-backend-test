import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule, CommonService, ExceptionFilter } from '@app/common';
import { DbModule } from '@app/db';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    CommonModule,
    DbModule,
    RedisModule,
    JwtModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_PIPE,
      inject: [CommonService],
      useFactory(commonService: CommonService) {
        return new ValidationPipe({
          exceptionFactory(data) {
            return commonService.createRpcException({
              status: HttpStatus.BAD_REQUEST,
              data,
            });
          },
          validationError: {
            value: false,
            target: false,
          },
        });
      },
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class UserModule {}
