/**
 * Customer-Scoped Mock Data Layer for Zylo Stream.
 * Dedicated to customer demo identity: customer_demo_001 (Eleanor Vance / Acme Creative Studio).
 * All customer routes derive information from these scoped records.
 */

export const MOCK_CUSTOMER_USER = {
  id: 'customer_demo_001',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@acmestudio.io',
  company: 'Acme Creative Studio',
  role: 'customer',
  phone: '+1 (555) 234-8901',
  address: '450 Lexington Ave, Suite 1400, New York, NY 10017',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  defaultPaymentMethod: 'Visa ending in 4421',
  taxId: 'US-EIN-99218204',
  memberSince: '2024-05-15'
};

export const MOCK_ADMIN_USER = {
  id: 'admin_demo_001',
  name: 'Julian Sterling',
  email: 'admin@zylostream.io',
  company: 'Zylo Stream Global Operations',
  role: 'admin',
  phone: '+1 (555) 912-3456',
  address: '555 California St, Suite 3200, San Francisco, CA 94104',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  memberSince: '2023-11-01'
};

export const INITIAL_CUSTOMER_SUBSCRIPTIONS = [
  {
    id: 'sub_c1',
    subscriptionNumber: 'SUB-ZYLO-701',
    customerId: 'customer_demo_001',
    customerName: 'Acme Creative Studio',
    planId: 'plan_growth_m',
    planName: 'Growth Accelerate',
    billingInterval: 'Monthly',
    amount: 1450,
    status: 'active',
    startDate: '2024-05-15',
    renewalDate: '2026-11-15',
    autoRenew: true,
    paymentMethod: 'Visa •••• 4421',
    features: [
      'Up to 5,000 subscribers',
      'Advanced revenue forecasting',
      'Automated tax calculations',
      '4-hour SLA response',
      'Custom webhook triggers'
    ],
    notes: 'Primary production subscription for Acme Creative Studio.'
  },
  {
    id: 'sub_c2',
    subscriptionNumber: 'SUB-ZYLO-702',
    customerId: 'customer_demo_001',
    customerName: 'Acme Creative Studio',
    planId: 'plan_pilot_w',
    planName: 'Sprint Sandbox',
    billingInterval: 'Weekly',
    amount: 180,
    status: 'active',
    startDate: '2026-06-01',
    renewalDate: '2026-11-08',
    autoRenew: true,
    paymentMethod: 'ACH •••• 8812',
    features: [
      'Sandbox simulation environment',
      '1,000 test transactions/week',
      'Live webhook debugger',
      'Community support'
    ],
    notes: 'Developer sandbox environment for QA and billing testing.'
  }
];

export const INITIAL_CUSTOMER_INVOICES = [
  {
    id: 'inv_c1',
    invoiceNumber: 'INV-2026-C01',
    customerId: 'customer_demo_001',
    customerName: 'Acme Creative Studio',
    subscriptionId: 'sub_c1',
    issueDate: '2026-10-15',
    dueDate: '2026-10-30',
    subtotal: 1450,
    tax: 116,
    discount: 100,
    total: 1466,
    paidAmount: 1466,
    outstandingAmount: 0,
    status: 'Paid',
    paidDate: '2026-10-16',
    paymentMethod: 'Visa •••• 4421',
    lineItems: [
      {
        description: 'Growth Accelerate - Monthly Recurring Service (Oct 15 - Nov 15, 2026)',
        quantity: 1,
        unitPrice: 1450,
        total: 1450
      }
    ]
  },
  {
    id: 'inv_c2',
    invoiceNumber: 'INV-2026-C02',
    customerId: 'customer_demo_001',
    customerName: 'Acme Creative Studio',
    subscriptionId: 'sub_c2',
    issueDate: '2026-10-24',
    dueDate: '2026-10-31',
    subtotal: 180,
    tax: 0,
    discount: 0,
    total: 180,
    paidAmount: 180,
    outstandingAmount: 0,
    status: 'Paid',
    paidDate: '2026-10-25',
    paymentMethod: 'ACH Direct Debit •••• 8812',
    lineItems: [
      {
        description: 'Sprint Sandbox Weekly Cycle (Oct 24 - Oct 31, 2026)',
        quantity: 1,
        unitPrice: 180,
        total: 180
      }
    ]
  },
  {
    id: 'inv_c3',
    invoiceNumber: 'INV-2026-C03',
    customerId: 'customer_demo_001',
    customerName: 'Acme Creative Studio',
    subscriptionId: 'sub_c1',
    issueDate: '2026-10-31',
    dueDate: '2026-11-15',
    subtotal: 1450,
    tax: 116,
    discount: 0,
    total: 1566,
    paidAmount: 0,
    outstandingAmount: 1566,
    status: 'Pending',
    paymentMethod: 'Visa •••• 4421 (Scheduled)',
    lineItems: [
      {
        description: 'Growth Accelerate - Upcoming Monthly Cycle (Nov 15 - Dec 15, 2026)',
        quantity: 1,
        unitPrice: 1450,
        total: 1450
      }
    ]
  }
];

export const INITIAL_CUSTOMER_PAYMENTS = [
  {
    id: 'pay_c1',
    paymentNumber: 'PAY-2026-C01',
    customerId: 'customer_demo_001',
    invoiceNumber: 'INV-2026-C01',
    paymentDate: '2026-10-16',
    paymentMethod: 'Visa •••• 4421',
    amount: 1466,
    status: 'Completed',
    transactionRef: 'ch_3N82JkL_cust_9912',
    notes: 'Auto-debit processed via Stripe.'
  },
  {
    id: 'pay_c2',
    paymentNumber: 'PAY-2026-C02',
    customerId: 'customer_demo_001',
    invoiceNumber: 'INV-2026-C02',
    paymentDate: '2026-10-25',
    paymentMethod: 'ACH Direct Debit •••• 8812',
    amount: 180,
    status: 'Completed',
    transactionRef: 'txn_ach_cust_44019',
    notes: 'Automated weekly ACH clearance.'
  }
];

export const INITIAL_CUSTOMER_NOTIFICATIONS = [
  {
    id: 'notif_c1',
    title: 'Upcoming Subscription Renewal',
    message: 'Your Sprint Sandbox plan will renew automatically on Nov 08, 2026 for $180.00.',
    timestamp: '2 hours ago',
    type: 'renewal',
    read: false
  },
  {
    id: 'notif_c2',
    title: 'Upcoming Invoice Scheduled',
    message: 'Invoice INV-2026-C03 ($1,566.00) is scheduled for automatic charge on Nov 15, 2026.',
    timestamp: '1 day ago',
    type: 'invoice',
    read: false
  },
  {
    id: 'notif_c3',
    title: 'Payment Succeeded',
    message: 'Payment of $180.00 for INV-2026-C02 was successfully debited via ACH •••• 8812.',
    timestamp: '6 days ago',
    type: 'payment',
    read: true
  },
  {
    id: 'notif_c4',
    title: 'Welcome to Zylo Stream',
    message: 'Your customer portal is active. Manage all your recurring plans and invoices on Autopilot.',
    timestamp: '2 weeks ago',
    type: 'system',
    read: true
  }
];
