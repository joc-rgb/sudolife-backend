import express, { Express, Request } from 'express';
import winston from 'winston';
import { SudoLifeServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
import { Response, Router } from 'express';

const log: winston.Logger = config.createLogger();
const router = Router();

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();

    const server: SudoLifeServer = new SudoLifeServer(app);
    server.start();
    Application.handleExit();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`[APP.TS]: There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on('unhandleRejection', (reason: Error) => {
      log.error(`[APP.TS]: Unhandled rejection at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      log.error('[APP.TS]: Caught SIGTERM');
      Application.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      log.error('[APP.TS]: Caught SIGINT');
      Application.shutDownProperly(2);
    });

    process.on('exit', () => {
      log.error('[APP.TS]: Exiting');
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('[APP.TS]: Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`[APP.TS]: Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
