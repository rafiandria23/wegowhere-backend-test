import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@app/jwt';
import { AuthMetadata } from '../constants/auth.constant';
import { AuthHttpRequest } from '../interfaces/auth.interface';
import { CommonService } from '../common.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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
      throw new UnauthorizedException('Authorization header is not found!');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Access token type is invalid!');
    } else if (!token) {
      throw new UnauthorizedException('Access token is not found!');
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(request, 'auth', payload);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async authenticateWs(ctx: ExecutionContext) {
    const client = ctx.switchToWs().getClient<Socket>();
    const authorizationHeader = _.get(
      client,
      'handshake.headers.authorization',
    );

    if (!authorizationHeader) {
      throw new WsException('Authorization header is not found!');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new WsException('Access token type is invalid!');
    } else if (!token) {
      throw new WsException('Access token is not found!');
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(client.handshake, 'auth', payload);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async authenticateRpc(ctx: ExecutionContext) {
    const message = ctx.switchToRpc().getContext<RmqContext>().getMessage();
    const authorizationHeader = _.get(
      message,
      'properties.headers.authorization',
    );

    if (!authorizationHeader) {
      throw this.commonService.createRpcException({
        status: HttpStatus.UNAUTHORIZED,
        data: 'Authorization header is not found!',
      });
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw this.commonService.createRpcException({
        status: HttpStatus.UNAUTHORIZED,
        data: 'Access token type is invalid!',
      });
    } else if (!token) {
      throw this.commonService.createRpcException({
        status: HttpStatus.UNAUTHORIZED,
        data: 'Access token is not found!',
      });
    }

    try {
      const payload = await this.jwtService.verify(token);

      _.set(message, 'auth', payload);
    } catch (err) {
      throw this.commonService.createRpcException({
        status: HttpStatus.UNAUTHORIZED,
        data: err.message,
      });
    }
  }
}
