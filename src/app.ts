import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '@/config';
import helmet from 'helmet';
import router from '@/routes';
import { connectDb, disconnectDb } from '@/libs/mongoose';

const { PORT, NODE_ENV, CLIENT_URL, SESSION_SECRET } = config;

const app = express();

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL],
    credentials: true,
  }),
  express.json(),
  helmet(),
  cookieParser(),
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 36e5,
    },
  })
);

(async function (): Promise<void> {
  try {
    // Connect  Db
    await connectDb();

    // Register routes
    app.use('/api/v1', router);

    // Centralized error handler
    app.use(
      (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled request error', err);

        if (res.headersSent) return;

        res.status(500).json({
          code: 'ServerError',
          message: 'An unexpected error occurred',
        });
      }
    );

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);

    if (NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

//  Handle Server graceful shutdown
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectDb();
    console.info('Server shutdown', signal);

    process.exit(0); // successful termination.
  } catch (err) {
    console.error('Error during server shutdown', err);

    process.exit(1);
  }
};

//Listen for termination signal and graceful shutdown
process.once('SIGTERM', serverTermination);
process.once('SIGINT', serverTermination);
