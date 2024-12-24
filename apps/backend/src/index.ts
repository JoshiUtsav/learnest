import dotenv from 'dotenv';
dotenv.config();

import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './routes/index.route';
import { CORS_ORIGIN, PORT } from './config/config';
import {
  databaseConnect,
  handleDatabaseConnectionError,
} from './database/index';
import logger from './config/logger';

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware() {
    this.app.use(express.json({ limit: '16kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '16kb' }));
    this.app.use(
      cors({
        origin: CORS_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(express.static('public'));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.use('/api', routes);
  }

  private initializeErrorHandling() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: express.NextFunction) => {
        logger.error(`Internal Server Error: ${err.message}`); // Log the error
        res.status(500).send(`Internal Server Error: ${err.message}`);
      }
    );
  }

  public async connectToDatabase() {
    try {
      await databaseConnect();
    } catch (error) {
      handleDatabaseConnectionError(error);
      throw new Error('Database connection failed');
    }
  }

  // This method will be called in the serverless handler
  public handleRequest(req: Request, res: Response) {
    this.connectToDatabase()
      .then(() => {
        this.app(req, res); // Use Express app to handle the request
      })
      .catch((error) => {
        logger.error(`Database connection error: ${(error as Error).message}`);
        res.status(500).send('Database connection failed');
      });
  }
}

// Instantiate the server class
const server = new Server();

// Export the Vercel handler function
export default function handler(req: Request, res: Response) {
  server.handleRequest(req, res);
}
