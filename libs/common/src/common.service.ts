import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class CommonService {
  successTimestamp(success: boolean = true) {
    return {
      success,
      timestamp: dayjs(),
    };
  }
}
