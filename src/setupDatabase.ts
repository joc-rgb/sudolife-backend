import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logger from 'bunyan';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';

dotenv.config();

const log: Logger = config.createLogger('database');

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('Successfully connected to database');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error(error);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect);
};
