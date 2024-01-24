import { registerAs } from '@nestjs/config';

export default registerAs('gateway', () => ({
  host: process.env.GATEWAY_HOST || '0.0.0.0',
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
}));
