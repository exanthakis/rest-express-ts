import express, { type Request, type Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '@/config';
import helmet from 'helmet';

const { PORT, NODE_ENV, CLIENT_URL } = config;

const app = express();

/**
 * Middlewares
 */
app.use(
  cors({
    origin: [CLIENT_URL],
    credentials: true,
  }),
  express.json(),
  helmet(),
  cookieParser()
);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world',
  });
});

app.listen(PORT, () => {
  console.log('NODE_ENV', NODE_ENV);
  console.log(`Server running http://localhost:${PORT}`);
});
