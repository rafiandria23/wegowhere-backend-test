import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@app/jwt';
import { AuthMetadata } from '../constants/auth.constant';
import { AuthHttpRequest } from '../interfaces/auth.interface';

@Injectable()
export class AuthWsGuard implements CanActivate {
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
      throw new WsException('');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new WsException('');
    }

    try {
      const tokenPayload = await this.jwtService.verify(token);

      _.set(req, 'auth', tokenPayload);
    } catch (err) {
      throw new WsException(err);
    }

    return true;
  }
}
