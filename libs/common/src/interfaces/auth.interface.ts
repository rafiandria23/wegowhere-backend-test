import { FastifyRequest } from 'fastify';

export interface AuthHttpRequest extends FastifyRequest {
  auth: {
    user_id: string;
  };
}
