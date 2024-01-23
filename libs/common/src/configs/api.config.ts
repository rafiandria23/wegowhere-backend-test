import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  host: process.env.API_HOST || '0.0.0.0',
  port: parseInt(process.env.API_PORT, 10) || 3000,
}));
