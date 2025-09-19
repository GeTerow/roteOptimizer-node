import express from 'express';
import type { Express, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors'
import { router } from '../infrastructure/http/routes.js';

const app: Express = express();
const PORT = process.env.PORT || 3009;


app.use(cors()) 
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(express.json());
app.use(router);

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
    console.log(`Ta rodando na porta ${PORT}`);
});