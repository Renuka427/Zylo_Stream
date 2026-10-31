import { logger } from '../utils/logger.js';
import { renewalService } from '../services/renewal.service.js';

/**
 * Scheduled recurring billing job runner.
 * Typically scheduled via cron (e.g. daily at midnight: '0 0 * * *').
 */
export const runRecurringBillingJob = async () => {
  logger.info('Starting recurring billing job execution...');
  try {
    const result = await renewalService.processDueRenewals();
    logger.info('Recurring billing job finished successfully', result);
  } catch (error) {
    logger.error('Failed executing recurring billing job', error);
  }
};
