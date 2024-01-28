import _ from 'lodash';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { RpcException } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { throwError } from 'rxjs';
import { isString } from 'tipe-apa';
import { CommonService } from '../common.service';
import { ChatSocketEvent } from '../events/chat.event';

@Catch()
export class ExceptionFilter
  implements
    NestExceptionFilter<HttpException | WsException | RpcException | Error>
{
  constructor(
    private readonly commonService: CommonService,
    private readonly httpAdapterHost: HttpAdapterHost<FastifyAdapter>,
  ) {}

  catch(
    exception: HttpException | WsException | RpcException | Error,
    host: ArgumentsHost,
  ) {
    const type = host.getType();

    switch (type) {
      case 'ws':
        return this.handleWs(exception, host.switchToWs());

      case 'rpc':
        return this.handleRpc(exception);

      case 'http':
      default:
        return this.handleHttp(exception, host.switchToHttp());
    }
  }

  handleHttp(exception: HttpException | Error, host: HttpArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    let errStatus: HttpStatus = _.defaultTo(
      _.get(exception, 'status'),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    let errData: string | object = _.defaultTo(
      _.get(exception, 'data'),
      'Oops! Something unexpected occurred.',
    );

    if (exception instanceof HttpException) {
      errStatus = exception.getStatus();
      errData = _.get(
        _.omit(exception.getResponse() as object, ['statusCode', 'error']),
        'message',
      );
    }

    if (isString(errData)) {
      errData = {
        message: errData,
      };
    }

    return httpAdapter.reply(
      host.getResponse(),
      this.commonService.successTimestamp({
        success: false,
        data: errData,
      }),
      errStatus,
    );
  }

  handleWs(exception: WsException | Error, host: WsArgumentsHost) {
    const client = host.getClient<Socket>();

    let errData: string | object = _.defaultTo(
      _.get(exception, 'data'),
      'Oops! Something unexpected occurred.',
    );

    if (exception instanceof WsException) {
      errData = exception.getError();
    }

    if (isString(errData)) {
      errData = {
        message: errData,
      };
    }

    client.emit(ChatSocketEvent.RECEIVE_ERROR, errData);
  }

  handleRpc(exception: RpcException | Error) {
    return throwError(() => {
      if (exception instanceof RpcException) {
        return exception.getError();
      }

      return exception;
    });
  }
}
