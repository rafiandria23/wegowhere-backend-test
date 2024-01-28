import { HttpStatus, Injectable } from '@nestjs/common';
import { RmqRecordBuilder, RpcException } from '@nestjs/microservices';
import dayjs from 'dayjs';
import { isString } from 'tipe-apa';

@Injectable()
export class CommonService {
  successTimestamp({ success = true, data = undefined } = {}) {
    const timestamp = dayjs();

    if (data || data === null) {
      return {
        success,
        timestamp,
        data,
      };
    }

    return {
      success,
      timestamp,
    };
  }

  buildRmqRecord<T = unknown>({
    authorization,
    payload,
  }: {
    authorization: string;
    payload: T;
  }) {
    const record = new RmqRecordBuilder<T>(payload)
      .setOptions({
        headers: {
          authorization,
        },
      })
      .build();

    return record;
  }

  createRpcException<T = unknown>({
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    data = 'Oops! Something unexpected occurred.' as T,
  }: {
    status?: HttpStatus;
    data?: T;
  }) {
    if (isString(data)) {
      data = {
        message: data,
      } as T;
    }

    return new RpcException({
      status,
      data,
    });
  }
}
