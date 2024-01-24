import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class CommonService {
  successTimestamp({ success = true, data = null } = {}) {
    const timestamp = dayjs();

    if (data) {
      return {
        success,
        timestamp,
        data,
      };
    }

    return {
      success,
      timestamp: dayjs(),
    };
  }
}
