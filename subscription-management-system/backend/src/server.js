import dotenv from 'dotenv';
import app from './app.js';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`====================================================`);
  logger.info(` Subscription Management System API Server Running  `);
  logger.info(` Port:        ${PORT}                                `);
  logger.info(` Healthcheck: http://localhost:${PORT}/api/health    `);
  logger.info(` Mode:        ${process.env.NODE_ENV || 'development'}`);
  logger.info(`====================================================`);
});

// Handle graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
