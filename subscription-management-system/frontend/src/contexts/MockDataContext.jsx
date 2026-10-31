import React, { createContext, useContext, useState, useMemo } from 'react';
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

const MockDataContext = createContext(null);

export const MockDataProvider = ({ children }) => {
  const { showToast } = useToast();

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const addActivity = (title, description, badge = 'System', type = 'info') => {
    const newAct = {
      id: `act_${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      badge,
      type
    };
    setActivityLog((prev) => [newAct, ...prev]);
  };

  // --- Subscriptions Actions ---
  const addSubscription = (newSub) => {
    const subNumber = `SUB-2026-${String(subscriptions.length + 1).padStart(3, '0')}`;
    const entry = {
      ...newSub,
      id: `sub_${Date.now()}`,
      subscriptionNumber: subNumber,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      autoRenew: true
    };
    setSubscriptions((prev) => [entry, ...prev]);
    addActivity('Subscription Activated', `Created subscription ${subNumber} for ${newSub.customerName}`, 'Subscription', 'subscription_created');
    showToast(`Subscription ${subNumber} successfully created!`);
  };

  const updateSubscriptionStatus = (id, newStatus) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const sub = subscriptions.find((s) => s.id === id);
    addActivity(`Subscription ${newStatus.toUpperCase()}`, `Updated status of ${sub?.subscriptionNumber || id} to ${newStatus}`, 'Subscription');
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

  // --- Customers Actions ---
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

  // --- Products & Plans Actions ---
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

  // --- Quotations Actions ---
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

  const updateQuotationStatus = (id, status) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    showToast(`Quotation updated to ${status}`);
  };

  // --- Invoices Actions ---
  const addInvoice = (invoiceData) => {
    const invNumber = `INV-2026-${String(invoices.length + 101)}`;
    const newInv = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      issueDate: new Date().toISOString().split('T')[0],
      paidAmount: 0,
      outstandingAmount: invoiceData.total || 0,
      status: 'Confirmed'
    };
    setInvoices((prev) => [newInv, ...prev]);
    addActivity('Invoice Issued', `Issued invoice ${invNumber} for ${newInv.customerName} ($${newInv.total})`, 'Invoice');
    showToast(`Invoice ${invNumber} generated!`);
  };

  const markInvoicePaid = (id) => {
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
    const target = invoices.find((i) => i.id === id);
    if (target) {
      recordPayment({
        customerId: target.customerId,
        customerName: target.customerName,
        invoiceNumber: target.invoiceNumber,
        paymentMethod: 'Manual Settlement / Card',
        amount: target.outstandingAmount || target.total,
        notes: 'Marked as paid from invoice ledger.'
      });
    }
    showToast('Invoice marked as paid!');
  };

  // --- Payments Actions ---
  const recordPayment = (paymentData) => {
    const payNumber = `PAY-2026-${String(payments.length + 901)}`;
    const newPayment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      paymentNumber: payNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      transactionRef: `txn_manual_${Date.now().toString().slice(-6)}`
    };
    setPayments((prev) => [newPayment, ...prev]);
    addActivity('Payment Captured', `Recorded ${payNumber}: $${newPayment.amount} from ${newPayment.customerName}`, 'Payment');
    showToast(`Payment ${payNumber} recorded successfully!`);
  };

  // --- Discounts Actions ---
  const addDiscount = (disc) => {
    const newDisc = {
      ...disc,
      id: `disc_${Date.now()}`,
      usageCount: 0,
      status: 'Active'
    };
    setDiscounts((prev) => [newDisc, ...prev]);
    addActivity('Promotion Activated', `Created coupon code: ${newDisc.code}`, 'Discount');
    showToast(`Discount coupon ${newDisc.code} created!`);
  };

  // --- Settings Actions ---
  const updateSettings = (section, updates) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    showToast('Preferences updated successfully!');
  };

  // --- Derived KPI Calculations ---
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
        addSubscription,
        updateSubscriptionStatus,
        renewSubscription,
        addCustomer,
        addProduct,
        addPlan,
        addQuotation,
        updateQuotationStatus,
        addInvoice,
        markInvoicePaid,
        recordPayment,
        addDiscount,
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
