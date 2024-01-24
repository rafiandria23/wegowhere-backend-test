import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@app/jwt';
import { AuthMetadata } from '../constants/auth.constant';
import { AuthHttpRequest } from '../interfaces/auth.interface';

@Injectable()
export class AuthRpcGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AuthMetadata.PUBLIC,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<AuthHttpRequest>();
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      const tokenPayload = await this.jwtService.verify(token);

      _.set(req, 'auth', tokenPayload);
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    return true;
  }
}
