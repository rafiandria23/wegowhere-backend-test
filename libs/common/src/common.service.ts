import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SuccessTimestamp } from './dto/success-timestamp.dto';

@Injectable()
export class CommonService {
  successTimestamp(success: boolean = true): SuccessTimestamp {
    return {
      success,
      timestamp: dayjs(),
    };
  }
}
