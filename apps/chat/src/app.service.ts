import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  health() {
    return {
      success: true,
      timestamp: dayjs(),
    };
  }
}
