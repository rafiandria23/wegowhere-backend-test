import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: _.defaultTo(process.env.REDIS_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.REDIS_PORT, 10), 6379),
  pass: _.defaultTo(process.env.REDIS_PASS, 'wegowhere'),
}));
