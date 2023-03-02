import { config } from '@root/config';
import winston from 'winston';

import { BaseCache } from './base.cache';

const log: winston.Logger = config.createLogger();

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (err) {
      log.error(err);
    }
  }
}

export const redisConnection = new RedisConnection();
