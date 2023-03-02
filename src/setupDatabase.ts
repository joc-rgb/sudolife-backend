import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';
import winston from 'winston';

dotenv.config();

const log: winston.Logger = config.createLogger();

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('[SETUPDATABASE]: Successfully connected to database');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error(`[SETUPDATABASE.TS]: ${error}`);

        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect);
};
