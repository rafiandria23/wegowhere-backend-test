import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async cacheResult<A = unknown, T = unknown>({
    key,
    handler,
    ttl = 60 * 60 * 24,
  }: {
    key: string;
    handler: {
      args?: A;
      fn(args?: A): Promise<T>;
    };
    ttl?: number;
  }) {
    const cachedResult = await this.cacheManager.get(key);

    if (!cachedResult) {
      const result = await handler.fn(handler.args);

      if (!result) {
        return null;
      }

      await this.cacheManager.set(key, JSON.stringify(result), ttl);

      return result;
    }

    return JSON.parse(cachedResult as string);
  }

  async get<T = unknown>(key: string) {
    const cachedResult = await this.cacheManager.get<string>(key);

    return JSON.parse(cachedResult) as T;
  }

  async set<T = unknown>({
    key,
    payload,
    ttl = 60 * 60 * 24,
  }: {
    key: string;
    payload: T;
    ttl?: number;
  }) {
    await this.cacheManager.set(key, JSON.stringify(payload), ttl);
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
