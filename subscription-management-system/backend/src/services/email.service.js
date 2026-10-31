import { logger } from '../utils/logger.js';

/**
 * Service managing transactional emails (invoices, renewal notices, payment alerts).
 */
export const emailService = {
  sendInvoiceEmail: async ({ recipientEmail, invoiceData }) => {
    logger.info(`Sending invoice email to ${recipientEmail}`);
    return { success: true };
  },

  sendRenewalReminder: async ({ recipientEmail, daysUntilRenewal }) => {
    logger.info(`Sending renewal reminder to ${recipientEmail} (${daysUntilRenewal} days remaining)`);
    return { success: true };
  }
};
