import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log(' Starting Zylo Stream API Integration Test Suite    ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  let customerToken = '';
  let adminToken = '';
  let testSubId = '';
  let testInvoiceId = '';

  // 1. Healthcheck
  await test('1. GET /api/health returns 200 OK and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.status, 'healthy');
  });

  // 2. Public Plans
  await test('2. GET /api/plans returns active subscription catalog', async () => {
    const res = await fetch(`${BASE_URL}/plans`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 3);
  });

  // 3. Customer Registration
  const testEmail = `cust_test_${Date.now()}@example.com`;
  await test('3. POST /api/auth/register creates customer account with role: customer', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        email: testEmail,
        password: 'Password123!',
        company: 'Test Corp Ltd'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, 'customer');
    assert.ok(data.data.token);
    assert.strictEqual(data.data.user.password_hash, undefined); // Never leaked
    customerToken = data.data.token;
  });

  // 4. Duplicate Registration Rejection
  await test('4. POST /api/auth/register prevents duplicate email registration (409 Conflict)', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate',
        email: testEmail,
        password: 'Password123!'
      })
    });
    assert.strictEqual(res.status, 409);
  });

  // 5. Customer Login
  await test('5. POST /api/auth/login authorizes customer with valid credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, 'customer');
    customerToken = data.data.token;
  });

  // 6. Invalid Password Rejection
  await test('6. POST /api/auth/login rejects invalid password (401 Unauthorized)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!'
      })
    });
    assert.strictEqual(res.status, 401);
  });

  // 7. Admin Login
  await test('7. POST /api/auth/admin-login authorizes admin (admin@zylostream.io)', async () => {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@zylostream.io',
        password: 'admin-super-pass-2026'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, 'admin');
    adminToken = data.data.token;
  });

  // 8. Admin Login Rejection for Customer Account
  await test('8. POST /api/auth/admin-login blocks customer account from admin access (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    assert.strictEqual(res.status, 403);
  });

  // 9. Customer Session Endpoint
  await test('9. GET /api/auth/me returns authenticated customer profile', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.user.email, testEmail);
    assert.strictEqual(data.data.user.role, 'customer');
  });

  // 10. Customer Stats
  await test('10. GET /api/customer/stats returns customer-specific metrics', async () => {
    const res = await fetch(`${BASE_URL}/customer/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(typeof data.data.monthlySpend, 'number');
  });

  // 11. Customer Creates Subscription
  await test('11. POST /api/customer/subscriptions activates subscription and generates invoice', async () => {
    const res = await fetch(`${BASE_URL}/customer/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ plan_id: 'plan_pro_monthly' })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.subscriptionId);
    assert.ok(data.data.invoiceId);
    testSubId = data.data.subscriptionId;
    testInvoiceId = data.data.invoiceId;
  });

  // 12. Customer Invoices List
  await test('12. GET /api/customer/invoices returns invoices for the customer', async () => {
    const res = await fetch(`${BASE_URL}/customer/invoices`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 1);
  });

  // 13. Customer Payment Transaction
  await test('13. POST /api/customer/payments settles invoice and records transaction reference', async () => {
    const res = await fetch(`${BASE_URL}/customer/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        invoice_id: testInvoiceId,
        amount: 149.00,
        payment_method: 'Credit Card'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.data.status, 'succeeded');
    assert.ok(data.data.transactionReference);
  });

  // 14. Customer Cancels Subscription
  await test('14. DELETE /api/customer/subscriptions/:id cancels subscription', async () => {
    const res = await fetch(`${BASE_URL}/customer/subscriptions/${testSubId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.status, 'cancelled');
  });

  // 15. RBAC Protection: Customer Forbidden on Admin API
  await test('15. GET /api/admin/stats BLOCKS customer access (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  // 16. Admin Access to Executive Overview
  await test('16. GET /api/admin/stats returns Executive Overview, KPIs, and revenue trends', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.data.kpis);
    assert.ok(Array.isArray(data.data.revenueTrends));
    assert.ok(Array.isArray(data.data.statusDistribution));
  });

  // 17. Admin Customer Directory
  await test('17. GET /api/admin/customers lists registered customer accounts', async () => {
    const res = await fetch(`${BASE_URL}/admin/customers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.data));
  });

  // 18. Admin Invoices
  await test('18. GET /api/admin/invoices returns all platform billing invoices', async () => {
    const res = await fetch(`${BASE_URL}/admin/invoices`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.data));
  });

  // 19. Admin Creates New Plan
  await test('19. POST /api/admin/plans creates a new subscription tier', async () => {
    const res = await fetch(`${BASE_URL}/admin/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Growth Accelerate',
        description: 'Mid-market scaling plan',
        price: 299.00,
        billing_cycle: 'monthly',
        features: ['Up to 500 Subscriptions', 'Dedicated Webhooks']
      })
    });
    assert.strictEqual(res.status, 201);
  });

  // 20. Logout
  await test('20. POST /api/auth/logout clears session', async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST'
    });
    assert.strictEqual(res.status, 200);
  });

  console.log('\n====================================================');
  console.log(` Test Results: ${passed} Passed, ${failed} Failed    `);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
