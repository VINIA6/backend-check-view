import express from 'express';
import cors from 'cors';
import { routes } from './presentation/routes';

const app = express();

// Middlewares globais
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Error handling middleware
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export { app };

