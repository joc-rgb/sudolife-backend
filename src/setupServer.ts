import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import applicationRoutes from '@root/routes';
import { config } from '@root/config';
import winston from 'winston';
import express from 'express';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';

const SERVER_PORT = 5000;
const log: winston.Logger = config.createLogger();

export class SudoLifeServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);

    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: ['test1', 'test2'],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development'
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true, //important
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'UPDATE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application) {
    app.use(express.json());
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      const io = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);

      this.socketIoConnections(io);
    } catch (error: any) {
      log.error(`[SETUPSERVER.TS]: ${error}`);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'UPDATE', 'PUT', 'OPTIONS']
      }
    });

    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      log.info(`[SETUPSERVER.TS]: Server running on PORT: ${SERVER_PORT}`);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private socketIoConnections(io: Server): void {}
  private globalErrorHandler(app: Application): void {
    //Handle routes error only
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(`[SETUPSERVER.TS]: ${error}`);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }
}
