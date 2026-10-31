import crypto from 'crypto';
import { db } from '../../config/database.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

/**
 * Customer Overview Statistics
 */
export async function getCustomerStats(req, res) {
  try {
    const userId = req.user.id;

    const subs = await db.query(
      `SELECT s.*, p.name as plan_name, p.price as plan_price, p.billing_cycle 
       FROM subscriptions s
       JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.user_id = ?`,
      [userId]
    );

    const invoices = await db.query('SELECT * FROM invoices WHERE user_id = ?', [userId]);
    const payments = await db.query('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const activeSubs = subs.filter((s) => s.status === 'active');
    
    // Calculate Monthly Recurring Cost
    const monthlyCost = activeSubs.reduce((sum, s) => {
      const price = parseFloat(s.plan_price || 0);
      if (s.billing_cycle === 'yearly') return sum + price / 12;
      if (s.billing_cycle === 'weekly') return sum + price * 4;
      return sum + price;
    }, 0);

    // Next renewal
    const nextRenewal = activeSubs.sort((a, b) => new Date(a.next_billing_date) - new Date(b.next_billing_date))[0] || null;

    // Outstanding balance
    const outstandingBalance = invoices
      .filter((inv) => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

    return sendSuccess(res, {
      activeSubscriptionsCount: activeSubs.length,
      monthlySpend: parseFloat(monthlyCost.toFixed(2)),
      nextRenewalDate: nextRenewal ? nextRenewal.next_billing_date : null,
      outstandingBalance: parseFloat(outstandingBalance.toFixed(2)),
      totalInvoicesCount: invoices.length,
      totalPaymentsCount: payments.length
    }, 'Customer statistics retrieved successfully.');
  } catch (err) {
    console.error('Customer stats error:', err);
    return sendError(res, 'Failed to retrieve customer statistics.', 500);
  }
}

/**
 * Get Subscriptions for Authenticated Customer
 */
export async function getCustomerSubscriptions(req, res) {
  try {
    const userId = req.user.id;
    const subs = await db.query(
      `SELECT s.id, s.user_id, s.plan_id, s.start_date, s.next_billing_date, s.status, s.created_at,
              p.name as plan_name, p.price, p.billing_cycle, p.features
       FROM subscriptions s
       JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [userId]
    );

    return sendSuccess(res, subs, 'Subscriptions retrieved successfully.');
  } catch (err) {
    console.error('Get subscriptions error:', err);
    return sendError(res, 'Failed to retrieve subscriptions.', 500);
  }
}

/**
 * Create a Subscription for Authenticated Customer
 */
export async function createCustomerSubscription(req, res) {
  try {
    const userId = req.user.id;
    const { plan_id } = req.body;

    // Verify Plan
    const plans = await db.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id]);
    if (!plans || plans.length === 0) {
      return sendError(res, 'Requested subscription plan not found.', 404);
    }

    const plan = plans[0];
    const subId = `sub_${crypto.randomUUID()}`;
    const invoiceId = `inv_${crypto.randomUUID()}`;
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const startDate = new Date().toISOString().split('T')[0];
    const nextBilling = new Date();
    if (plan.billing_cycle === 'yearly') {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    } else {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    }
    const nextBillingDate = nextBilling.toISOString().split('T')[0];

    // Transaction execution
    await db.transaction(async (conn) => {
      // 1. Insert Subscription
      await conn.query(
        'INSERT INTO subscriptions (id, user_id, plan_id, start_date, next_billing_date, status) VALUES (?, ?, ?, ?, ?, ?)',
        [subId, userId, plan_id, startDate, nextBillingDate, 'active']
      );

      // 2. Generate Initial Invoice
      await conn.query(
        'INSERT INTO invoices (id, user_id, subscription_id, invoice_number, amount, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [invoiceId, userId, subId, invoiceNumber, plan.price, startDate, 'Unpaid']
      );

      // 3. Activity Log
      await conn.query(
        'INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), userId, 'SUBSCRIPTION_CREATED', `Customer created subscription for plan "${plan.name}" ($${plan.price})`]
      );
    });

    return sendSuccess(res, {
      subscriptionId: subId,
      invoiceId,
      invoiceNumber,
      planName: plan.name,
      amount: plan.price
    }, 'Subscription activated successfully.', 201);
  } catch (err) {
    console.error('Create subscription error:', err);
    return sendError(res, 'Failed to create subscription.', 500);
  }
}

/**
 * Cancel an Active Subscription
 */
export async function cancelCustomerSubscription(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify ownership
    const existing = await db.query('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existing || existing.length === 0) {
      return sendError(res, 'Subscription not found or unauthorized.', 404);
    }

    await db.query('UPDATE subscriptions SET status = ?, updated_at = NOW() WHERE id = ?', ['cancelled', id]);

    await db.query(
      'INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), userId, 'SUBSCRIPTION_CANCELLED', `Subscription ${id} cancelled by customer`]
    );

    return sendSuccess(res, { id, status: 'cancelled' }, 'Subscription has been cancelled.');
  } catch (err) {
    console.error('Cancel subscription error:', err);
    return sendError(res, 'Failed to cancel subscription.', 500);
  }
}

/**
 * View Customer Invoices
 */
export async function getCustomerInvoices(req, res) {
  try {
    const userId = req.user.id;
    const invoices = await db.query(
      `SELECT i.*, p.name as plan_name 
       FROM invoices i
       LEFT JOIN subscriptions s ON i.subscription_id = s.id
       LEFT JOIN subscription_plans p ON s.plan_id = p.id
       WHERE i.user_id = ?
       ORDER BY i.created_at DESC`,
      [userId]
    );

    return sendSuccess(res, invoices, 'Invoices retrieved successfully.');
  } catch (err) {
    console.error('Get invoices error:', err);
    return sendError(res, 'Failed to retrieve invoices.', 500);
  }
}

/**
 * View Customer Payment History
 */
export async function getCustomerPayments(req, res) {
  try {
    const userId = req.user.id;
    const payments = await db.query(
      `SELECT p.*, i.invoice_number
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return sendSuccess(res, payments, 'Payment history retrieved successfully.');
  } catch (err) {
    console.error('Get payments error:', err);
    return sendError(res, 'Failed to retrieve payments.', 500);
  }
}

/**
 * Record / Settle a Customer Payment (Simulated Gateway Transaction)
 */
export async function recordCustomerPayment(req, res) {
  try {
    const userId = req.user.id;
    const { invoice_id, amount, payment_method = 'Credit Card' } = req.body;

    // Verify invoice ownership
    const invoices = await db.query('SELECT * FROM invoices WHERE id = ? AND user_id = ?', [invoice_id, userId]);
    if (!invoices || invoices.length === 0) {
      return sendError(res, 'Invoice not found or unauthorized.', 404);
    }

    const invoice = invoices[0];
    if (invoice.status === 'Paid') {
      return sendError(res, 'Invoice is already settled.', 400);
    }

    const paymentId = `pmt_${crypto.randomUUID()}`;
    const txRef = `tx_sim_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;

    await db.transaction(async (conn) => {
      // 1. Insert Payment
      await conn.query(
        'INSERT INTO payments (id, user_id, invoice_id, amount, payment_method, transaction_reference, status, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [paymentId, userId, invoice_id, amount || invoice.amount, payment_method, txRef, 'succeeded']
      );

      // 2. Mark Invoice as Paid
      await conn.query('UPDATE invoices SET status = ? WHERE id = ?', ['Paid', invoice_id]);

      // 3. Activity Log
      await conn.query(
        'INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), userId, 'PAYMENT_RECORDED', `Payment of $${invoice.amount} settled for invoice ${invoice.invoice_number} (Ref: ${txRef})`]
      );
    });

    return sendSuccess(res, {
      paymentId,
      invoiceId: invoice_id,
      amount: invoice.amount,
      status: 'succeeded',
      transactionReference: txRef,
      isSimulated: true
    }, 'Payment processed and invoice marked as Paid.', 201);
  } catch (err) {
    console.error('Record payment error:', err);
    return sendError(res, 'Failed to record payment.', 500);
  }
}
