import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  host: process.env.RMQ_HOST || '127.0.0.1',
  port: parseInt(process.env.RMQ_PORT, 10) || 5672,
  user: process.env.RMQ_USER,
  pass: process.env.RMQ_PASS,
}));
