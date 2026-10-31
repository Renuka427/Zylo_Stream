import dotenv from 'dotenv';
import app from './app.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize PostgreSQL (Supabase) or local MySQL pool and start server
async function startServer() {
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    logger.info(`====================================================`);
    logger.info(` Zylo Stream Backend API Server Running             `);
    logger.info(` Port:        ${PORT}                                `);
    logger.info(` Healthcheck: http://localhost:${PORT}/api/health    `);
    logger.info(` Mode:        ${process.env.NODE_ENV || 'development'}`);
    logger.info(`====================================================`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} signal received: closing HTTP server cleanly...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Fatal error starting server:', err);
  process.exit(1);
});
