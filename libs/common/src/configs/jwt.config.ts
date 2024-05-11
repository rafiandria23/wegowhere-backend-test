import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: _.defaultTo(process.env.JWT_SECRET, 'wegowhere'),
}));
