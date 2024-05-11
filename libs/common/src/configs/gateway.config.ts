import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export default registerAs('gateway', () => ({
  host: _.defaultTo(process.env.GATEWAY_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.GATEWAY_PORT, 10), 3000),
}));
