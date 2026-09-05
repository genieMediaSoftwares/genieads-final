import express from 'express';
import { apiRouter } from './routes';

export function createBackendApp() {
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  // Mount API endpoints
  router.use('/api', apiRouter);

  return router;
}
