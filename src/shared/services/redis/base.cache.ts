import { config } from '@root/config';

import { createClient } from 'redis';
import winston from 'winston';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  log: winston.Logger;

  constructor(cacheName: string) {
    this.client = createClient({ url: config.REDIS_HOST });
    this.log = config.createLogger();
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.log.error(`[BASECACHE]: ${error}`);
    });
  }
}
