import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      this.handleError(key, error, 'GET');
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.set(key, stringValue, 'EX', ttl);
      } else {
        await this.redis.set(key, stringValue);
      }
    } catch (error) {
      this.handleError(key, error, 'SET');
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.handleError(key, error, 'DEL');
    }
  }

  private handleError(key: string, error: unknown, operation: string) {
    const message = (error as Error).message || 'Error desconocido';
    this.logger.error(`Redis ${operation} Error${key}: ${message}`);
  }
}
