import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_QUOTATIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_DISCOUNTS,
  INITIAL_ACTIVITY_LOG,
  INITIAL_SETTINGS,
  REVENUE_TRENDS_DATA,
  SUBSCRIPTION_STATUS_DISTRIBUTION
} from '../mock/mockData';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'SMS_MOCK_DATA_v1';

const MockDataContext = createContext(null);

export const MockDataProvider = ({ children }) => {
  const { showToast } = useToast();

  // Helper to load persisted state or fallback
  const loadState = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [customers, setCustomers] = useState(() => loadState('customers', INITIAL_CUSTOMERS));
  const [products, setProducts] = useState(() => loadState('products', INITIAL_PRODUCTS));
  const [plans, setPlans] = useState(() => loadState('plans', INITIAL_PLANS));
  const [subscriptions, setSubscriptions] = useState(() => loadState('subscriptions', INITIAL_SUBSCRIPTIONS));
  const [quotations, setQuotations] = useState(() => loadState('quotations', INITIAL_QUOTATIONS));
  const [invoices, setInvoices] = useState(() => loadState('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState(() => loadState('payments', INITIAL_PAYMENTS));
  const [discounts, setDiscounts] = useState(() => loadState('discounts', INITIAL_DISCOUNTS));
  const [activityLog, setActivityLog] = useState(() => loadState('activityLog', INITIAL_ACTIVITY_LOG));
  const [settings, setSettings] = useState(() => loadState('settings', INITIAL_SETTINGS));

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
      localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
      localStorage.setItem(`${STORAGE_KEY}_quotations`, JSON.stringify(quotations));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_discounts`, JSON.stringify(discounts));
      localStorage.setItem(`${STORAGE_KEY}_activityLog`, JSON.stringify(activityLog));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn('localStorage sync error:', e);
    }
  }, [customers, products, plans, subscriptions, quotations, invoices, payments, discounts, activityLog, settings]);

  const addActivity = (title, description, badge = 'System', type = 'info') => {
    const newAct = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title,
      description,
      timestamp: 'Just now',
      badge,
      type
    };
    setActivityLog((prev) => [newAct, ...prev]);
  };

  // Reset entire demo data to factory defaults
  const resetDemoData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setPlans(INITIAL_PLANS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setQuotations(INITIAL_QUOTATIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setDiscounts(INITIAL_DISCOUNTS);
    setActivityLog(INITIAL_ACTIVITY_LOG);
    setSettings(INITIAL_SETTINGS);
    showToast('All demo records restored to factory defaults.', 'info');
  };

  // ==========================================
  // SUBSCRIPTIONS CRUD
  // ==========================================
  const addSubscription = (newSub) => {
    const subNumber = `SUB-2026-${String(subscriptions.length + 101).padStart(3, '0')}`;
    const entry = {
      ...newSub,
      id: `sub_${Date.now()}`,
      subscriptionNumber: subNumber,
      status: 'active',
      startDate: newSub.startDate || new Date().toISOString().split('T')[0],
      renewalDate: newSub.renewalDate || '2026-11-30',
      autoRenew: newSub.autoRenew !== undefined ? newSub.autoRenew : true
    };
    setSubscriptions((prev) => [entry, ...prev]);

    // Update customer's subscription count and MRR
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === newSub.customerId
          ? {
              ...c,
              subscriptionCount: (c.subscriptionCount || 0) + 1,
              mrr: (c.mrr || 0) + (Number(newSub.amount) || 0)
            }
          : c
      )
    );

    addActivity('Subscription Activated', `Created subscription ${subNumber} for ${newSub.customerName}`, 'Subscription');
    showToast(`Subscription ${subNumber} successfully activated!`);
  };

  const updateSubscription = (id, updates) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addActivity('Subscription Updated', `Updated details for subscription ${id}`, 'Subscription');
    showToast('Subscription updated successfully!');
  };

  const updateSubscriptionStatus = (id, newStatus) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const sub = subscriptions.find((s) => s.id === id);
    addActivity(`Subscription ${newStatus.toUpperCase()}`, `Changed status of ${sub?.subscriptionNumber || id} to ${newStatus}`, 'Subscription');
    showToast(`Subscription status updated to ${newStatus}`);
  };

  const renewSubscription = (id) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 1);
          return { ...s, renewalDate: nextDate.toISOString().split('T')[0], status: 'active' };
        }
        return s;
      })
    );
    addActivity('Manual Renewal', `Subscription ${id} renewed for next billing cycle.`, 'Renewal');
    showToast('Subscription renewed successfully!');
  };

  const deleteSubscription = (id) => {
    const sub = subscriptions.find((s) => s.id === id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    if (sub) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === sub.customerId
            ? {
                ...c,
                subscriptionCount: Math.max(0, (c.subscriptionCount || 1) - 1),
                mrr: Math.max(0, (c.mrr || 0) - (Number(sub.amount) || 0))
              }
            : c
        )
      );
    }
    addActivity('Subscription Removed', `Deleted subscription contract ${sub?.subscriptionNumber || id}`, 'Subscription', 'warning');
    showToast('Subscription contract deleted.');
  };

  // ==========================================
  // CUSTOMERS CRUD
  // ==========================================
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      subscriptionCount: 0,
      totalSpent: 0,
      mrr: 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addActivity('Customer Enrolled', `Registered customer profile: ${newCustomer.name}`, 'Customer');
    showToast(`Customer ${newCustomer.name} added successfully!`);
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer profile updated.');
  };

  const deleteCustomer = (id) => {
    const cust = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addActivity('Customer Deleted', `Removed customer account: ${cust?.name || id}`, 'Customer', 'warning');
    showToast(`Customer ${cust?.name || id} removed from ledger.`, 'warning');
  };

  // ==========================================
  // PRODUCTS CRUD
  // ==========================================
  const addProduct = (prod) => {
    const newProduct = {
      ...prod,
      id: `prod_${Date.now()}`,
      status: 'active'
    };
    setProducts((prev) => [newProduct, ...prev]);
    addActivity('Product Listed', `Added catalog product: ${newProduct.name}`, 'Catalog');
    showToast(`Product ${newProduct.name} saved!`);
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addActivity('Product Removed', `Archived product: ${prod?.name || id}`, 'Catalog', 'warning');
    showToast(`Product ${prod?.name || id} removed from catalog.`);
  };

  // ==========================================
  // PLANS CRUD
  // ==========================================
  const addPlan = (plan) => {
    const newPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      highlighted: false
    };
    setPlans((prev) => [newPlan, ...prev]);
    addActivity('Plan Configured', `Published pricing tier: ${newPlan.name}`, 'Plans');
    showToast(`Plan ${newPlan.name} created!`);
  };

  const updatePlan = (id, updates) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Pricing plan updated.');
  };

  const deletePlan = (id) => {
    const plan = plans.find((p) => p.id === id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    addActivity('Plan Removed', `Decommissioned pricing tier: ${plan?.name || id}`, 'Plans', 'warning');
    showToast(`Plan ${plan?.name || id} deleted.`);
  };

  // ==========================================
  // QUOTATIONS CRUD & ACTIONS
  // ==========================================
  const addQuotation = (quoteData) => {
    const qNumber = `QT-2026-${String(quotations.length + 8801)}`;
    const newQuote = {
      ...quoteData,
      id: `quote_${Date.now()}`,
      quotationNumber: qNumber,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setQuotations((prev) => [newQuote, ...prev]);
    addActivity('Quotation Drafted', `Created estimate ${qNumber} for ${newQuote.customerName}`, 'Quotation');
    showToast(`Quotation ${qNumber} drafted!`);
  };

  const updateQuotation = (id, updates) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
    showToast('Quotation updated successfully.');
  };

  const updateQuotationStatus = (id, status) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    addActivity(`Quotation ${status}`, `Quotation ${id} marked as ${status}`, 'Quotation');
    showToast(`Quotation updated to ${status}`);
  };

  const convertQuotationToSubscription = (quoteId) => {
    const quote = quotations.find((q) => q.id === quoteId);
    if (!quote) return;

    // 1. Mark quotation accepted
    updateQuotationStatus(quoteId, 'Accepted');

    // 2. Create active subscription
    const subNumber = `SUB-2026-${String(subscriptions.length + 101).padStart(3, '0')}`;
    const newSub = {
      id: `sub_${Date.now()}`,
      subscriptionNumber: subNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      planId: plans[0]?.id || 'plan_growth_m',
      planName: quote.lineItems?.[0]?.description || 'Custom Enterprise Plan',
      status: 'active',
      billingCycle: 'Monthly',
      amount: quote.total,
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: '2026-11-30',
      autoRenew: true,
      paymentMethod: 'Wire Transfer / Net-30',
      notes: `Converted from accepted quotation ${quote.quotationNumber}`
    };
    setSubscriptions((prev) => [newSub, ...prev]);

    // 3. Generate confirmed invoice
    addInvoice({
      customerId: quote.customerId,
      customerName: quote.customerName,
      subscriptionId: newSub.id,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      subtotal: quote.subtotal,
      tax: quote.tax,
      discount: quote.discount,
      total: quote.total,
      lineItems: quote.lineItems
    });

    addActivity('Quote Converted', `Converted ${quote.quotationNumber} to subscription ${subNumber}`, 'Quotation');
    showToast(`Quotation converted to subscription ${subNumber} and invoice generated!`);
  };

  const deleteQuotation = (id) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    showToast('Quotation deleted.');
  };

  // ==========================================
  // INVOICES CRUD & ACTIONS
  // ==========================================
  const addInvoice = (invoiceData) => {
    const invNumber = `INV-2026-${String(invoices.length + 101)}`;
    const newInv = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
      paidAmount: 0,
      outstandingAmount: invoiceData.total || 0,
      status: invoiceData.status || 'Confirmed'
    };
    setInvoices((prev) => [newInv, ...prev]);
    addActivity('Invoice Issued', `Issued invoice ${invNumber} for ${newInv.customerName} ($${newInv.total})`, 'Invoice');
    showToast(`Invoice ${invNumber} generated!`);
  };

  const updateInvoice = (id, updates) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
    showToast('Invoice statement updated.');
  };

  const markInvoicePaid = (id) => {
    const target = invoices.find((i) => i.id === id);
    if (!target) return;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return {
            ...inv,
            paidAmount: inv.total,
            outstandingAmount: 0,
            status: 'Paid'
          };
        }
        return inv;
      })
    );

    // Record corresponding payment
    recordPayment({
      customerId: target.customerId,
      customerName: target.customerName,
      invoiceNumber: target.invoiceNumber,
      paymentMethod: 'Manual Settlement / Card',
      amount: target.outstandingAmount || target.total,
      notes: `Settled via invoice ledger (${target.invoiceNumber}).`
    });

    // Update customer's total spent
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === target.customerId
          ? { ...c, totalSpent: (c.totalSpent || 0) + (target.outstandingAmount || target.total) }
          : c
      )
    );

    showToast(`Invoice ${target.invoiceNumber} settled in full!`);
  };

  const voidInvoice = (id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'Draft', outstandingAmount: 0 } : inv
      )
    );
    showToast('Invoice marked as void/draft.');
  };

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast('Invoice removed from ledger.');
  };

  // ==========================================
  // PAYMENTS CRUD
  // ==========================================
  const recordPayment = (paymentData) => {
    const payNumber = `PAY-2026-${String(payments.length + 901)}`;
    const newPayment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      paymentNumber: payNumber,
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      status: 'Completed',
      transactionRef: paymentData.transactionRef || `txn_${Date.now().toString().slice(-6)}`
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Also update customer's lifetime total
    if (paymentData.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === paymentData.customerId
            ? { ...c, totalSpent: (c.totalSpent || 0) + (Number(paymentData.amount) || 0) }
            : c
        )
      );
    }

    addActivity('Payment Captured', `Recorded ${payNumber}: $${newPayment.amount} from ${newPayment.customerName}`, 'Payment');
    showToast(`Payment ${payNumber} recorded successfully!`);
  };

  const deletePayment = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    showToast('Payment transaction record removed.', 'warning');
  };

  // ==========================================
  // DISCOUNTS CRUD
  // ==========================================
  const addDiscount = (disc) => {
    const newDisc = {
      ...disc,
      id: `disc_${Date.now()}`,
      usageCount: 0,
      status: 'Active'
    };
    setDiscounts((prev) => [newDisc, ...prev]);
    addActivity('Promotion Activated', `Created coupon voucher: ${newDisc.code}`, 'Discount');
    showToast(`Discount coupon ${newDisc.code} created!`);
  };

  const updateDiscount = (id, updates) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Discount voucher updated.');
  };

  const toggleDiscountStatus = (id) => {
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Expired' : 'Active' } : d
      )
    );
    const d = discounts.find((x) => x.id === id);
    const nextState = d?.status === 'Active' ? 'deactivated' : 'activated';
    showToast(`Voucher ${d?.code || id} ${nextState}.`);
  };

  const deleteDiscount = (id) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    showToast('Discount rule deleted.');
  };

  // ==========================================
  // SETTINGS
  // ==========================================
  const updateSettings = (section, updates) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    showToast('Preferences updated successfully!');
  };

  // ==========================================
  // DERIVED KPIS
  // ==========================================
  const kpis = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const mrr = activeSubs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const outstanding = invoices.reduce((acc, curr) => acc + (Number(curr.outstandingAmount) || 0), 0);
    const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

    return {
      activeSubscriptionsCount: activeSubs.length,
      activeSubsDelta: '+14.2% vs last month',
      mrr,
      mrrFormatted: `$${mrr.toLocaleString('en-US')}`,
      mrrDelta: '+8.6% vs last month',
      outstandingPayments: outstanding,
      outstandingFormatted: `$${outstanding.toLocaleString('en-US')}`,
      outstandingDelta: '-3.1% vs last month',
      overdueInvoicesCount: overdueCount,
      overdueDelta: overdueCount > 0 ? `${overdueCount} require attention` : 'All clear'
    };
  }, [subscriptions, invoices]);

  return (
    <MockDataContext.Provider
      value={{
        customers,
        products,
        plans,
        subscriptions,
        quotations,
        invoices,
        payments,
        discounts,
        activityLog,
        settings,
        revenueTrends: REVENUE_TRENDS_DATA,
        statusDistribution: SUBSCRIPTION_STATUS_DISTRIBUTION,
        kpis,
        resetDemoData,
        // Subscriptions
        addSubscription,
        updateSubscription,
        updateSubscriptionStatus,
        renewSubscription,
        deleteSubscription,
        // Customers
        addCustomer,
        updateCustomer,
        deleteCustomer,
        // Products
        addProduct,
        updateProduct,
        deleteProduct,
        // Plans
        addPlan,
        updatePlan,
        deletePlan,
        // Quotations
        addQuotation,
        updateQuotation,
        updateQuotationStatus,
        convertQuotationToSubscription,
        deleteQuotation,
        // Invoices
        addInvoice,
        updateInvoice,
        markInvoicePaid,
        voidInvoice,
        deleteInvoice,
        // Payments
        recordPayment,
        deletePayment,
        // Discounts
        addDiscount,
        updateDiscount,
        toggleDiscountStatus,
        deleteDiscount,
        // Settings
        updateSettings
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
