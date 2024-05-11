import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  host: _.defaultTo(process.env.RMQ_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.RMQ_PORT, 10), 5672),
  user: _.defaultTo(process.env.RMQ_USER, 'wegowhere'),
  pass: _.defaultTo(process.env.RMQ_PASS, 'wegowhere'),
}));
