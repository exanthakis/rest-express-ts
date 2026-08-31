import express, { type Request, type Response } from 'express';
import config from './config/index.ts';

const { PORT } = config;

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('OK');
});
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
