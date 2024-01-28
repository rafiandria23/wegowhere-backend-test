import { Injectable } from '@nestjs/common';
import { RmqRecordBuilder } from '@nestjs/microservices';
import dayjs from 'dayjs';

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
}
