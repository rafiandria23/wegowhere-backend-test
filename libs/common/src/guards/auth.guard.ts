import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@app/jwt';
import { AuthMetadata } from '../constants/auth.constant';
import { AuthHttpRequest } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AuthMetadata.PUBLIC,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const type = ctx.getType();

    switch (type) {
      case 'ws':
        await this.authenticateWs(ctx);
        break;

      case 'rpc':
        await this.authenticateRpc(ctx);
        break;

      case 'http':
      default:
        await this.authenticateHttp(ctx);
        break;
    }

    return true;
  }

  async authenticateHttp(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<AuthHttpRequest>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(request, 'auth', payload);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async authenticateWs(ctx: ExecutionContext) {
    const client = ctx.switchToWs().getClient<Socket>();
    const authorizationHeader = _.get(
      client,
      'handshake.headers.authorization',
    );

    if (!authorizationHeader) {
      throw new WsException('');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new WsException('');
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(client.handshake, 'auth', payload);
    } catch (err) {
      throw new WsException(err);
    }
  }

  async authenticateRpc(ctx: ExecutionContext) {
    const message = ctx.switchToRpc().getContext<RmqContext>().getMessage();
    const authorizationHeader = _.get(
      message,
      'properties.headers.authorization',
    );

    if (!authorizationHeader) {
      throw new RpcException('');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new RpcException('');
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(message, 'auth', payload);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
