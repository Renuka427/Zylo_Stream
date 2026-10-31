import { logger } from '../utils/logger.js';

/**
 * Service managing invoice generation, numbering, and line items.
 */
export const invoiceService = {
  generateInvoice: async ({ subscriptionId, customerId, lineItems = [] }) => {
    logger.info(`Generating invoice for subscription ${subscriptionId}`);
    return {
      invoiceNumber: `INV-${Date.now()}`,
      status: 'draft',
      subscriptionId,
      customerId,
      lineItems
    };
  }
};
