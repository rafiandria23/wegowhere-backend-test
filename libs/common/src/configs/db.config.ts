import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: _.defaultTo(process.env.DB_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.DB_PORT, 10), 27017),
  user: _.defaultTo(process.env.DB_USER, 'wegowhere'),
  pass: _.defaultTo(process.env.DB_PASS, 'wegowhere'),
  name: _.defaultTo(process.env.DB_NAME, 'wegowhere'),
}));
