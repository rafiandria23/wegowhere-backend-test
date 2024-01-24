import { Injectable } from '@nestjs/common';
import {
  JwtSignOptions,
  JwtVerifyOptions,
  JwtService as NestJwtService,
} from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private nestJwtService: NestJwtService) {}

  async sign<T = unknown>(
    payload: T,
    options?: Partial<JwtSignOptions>,
  ): Promise<string> {
    return await this.nestJwtService.signAsync(payload as any, options);
  }

  async verify<T = unknown>(
    payload: string,
    options?: Partial<JwtVerifyOptions>,
  ): Promise<T> {
    return (await this.nestJwtService.verifyAsync(payload, options)) as T;
  }
}
