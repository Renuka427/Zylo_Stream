import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

dotenv.config();

let pool = null;
let isMySqlConnected = false;

// In-Memory Fallback Store (populated with exact seed data for resilience)
const memoryStore = {
  users: [
    {
      id: 'usr_admin_001',
      name: 'Julian Sterling',
      email: 'admin@zylostream.io',
      password_hash: bcrypt.hashSync('admin-super-pass-2026', 10),
      google_id: null,
      role: 'admin',
      company: 'Zylo Stream Executive',
      created_at: new Date('2026-01-01T00:00:00Z'),
      updated_at: new Date('2026-01-01T00:00:00Z')
    },
    {
      id: 'usr_cust_001',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@acmestudio.io',
      password_hash: bcrypt.hashSync('demo-customer-2026', 10),
      google_id: null,
      role: 'customer',
      company: 'Acme Creative Studio',
      created_at: new Date('2026-01-10T00:00:00Z'),
      updated_at: new Date('2026-01-10T00:00:00Z')
    },
    {
      id: 'usr_cust_002',
      name: 'Marcus Vance',
      email: 'marcus.v@novatech.co',
      password_hash: bcrypt.hashSync('demo-customer-2026', 10),
      google_id: null,
      role: 'customer',
      company: 'NovaTech Solutions',
      created_at: new Date('2026-02-01T00:00:00Z'),
      updated_at: new Date('2026-02-01T00:00:00Z')
    },
    {
      id: 'usr_cust_003',
      name: 'Dr. Sophia Reyes',
      email: 's.reyes@quantumhealth.org',
      password_hash: bcrypt.hashSync('demo-customer-2026', 10),
      google_id: null,
      role: 'customer',
      company: 'Quantum Health Systems',
      created_at: new Date('2026-03-01T00:00:00Z'),
      updated_at: new Date('2026-03-01T00:00:00Z')
    }
  ],
  subscription_plans: [
    {
      id: 'plan_starter_monthly',
      name: 'Starter Ledger',
      description: 'Essential recurring billing for growing teams and boutique agencies.',
      price: 49.00,
      billing_cycle: 'monthly',
      status: 'active',
      features: ['Up to 25 Active Subscriptions', 'Automated Dunning Emails', 'Basic Financial Export', 'Community Support'],
      created_at: new Date('2026-01-01T00:00:00Z')
    },
    {
      id: 'plan_pro_monthly',
      name: 'Professional Autopilot',
      description: 'Comprehensive recurring revenue operations for scaling SaaS.',
      price: 149.00,
      billing_cycle: 'monthly',
      status: 'active',
      features: ['Up to 250 Active Subscriptions', 'Full Invoicing & Dunning Engine', 'Real-time Webhook Triggers', 'Priority Audit Support', 'Custom Branding'],
      created_at: new Date('2026-01-01T00:00:00Z')
    },
    {
      id: 'plan_enterprise_monthly',
      name: 'Enterprise Sovereign',
      description: 'Bespoke high-volume treasury orchestration with SLA guarantees.',
      price: 499.00,
      billing_cycle: 'monthly',
      status: 'active',
      features: ['Unlimited Subscriptions', 'Dedicated Account Orchestrator', 'Multi-Entity Consolidated Ledger', 'Custom Accounting Integrations', '99.99% Uptime SLA'],
      created_at: new Date('2026-01-01T00:00:00Z')
    },
    {
      id: 'plan_annual_sovereign',
      name: 'Annual Sovereign',
      description: 'Full annual subscription with 2 months complimentary access.',
      price: 3990.00,
      billing_cycle: 'yearly',
      status: 'active',
      features: ['All Enterprise Capabilities Included', 'Quarterly Financial Health Reviews', 'Bespoke Contract Review', 'White-glove Migration'],
      created_at: new Date('2026-01-01T00:00:00Z')
    }
  ],
  subscriptions: [
    {
      id: 'sub_001',
      user_id: 'usr_cust_001',
      plan_id: 'plan_pro_monthly',
      start_date: '2026-01-15',
      next_billing_date: '2026-11-15',
      status: 'active',
      created_at: new Date('2026-01-15T00:00:00Z'),
      updated_at: new Date('2026-10-15T00:00:00Z')
    },
    {
      id: 'sub_002',
      user_id: 'usr_cust_002',
      plan_id: 'plan_enterprise_monthly',
      start_date: '2026-02-01',
      next_billing_date: '2026-11-01',
      status: 'active',
      created_at: new Date('2026-02-01T00:00:00Z'),
      updated_at: new Date('2026-10-01T00:00:00Z')
    },
    {
      id: 'sub_003',
      user_id: 'usr_cust_003',
      plan_id: 'plan_starter_monthly',
      start_date: '2026-03-10',
      next_billing_date: '2026-11-10',
      status: 'active',
      created_at: new Date('2026-03-10T00:00:00Z'),
      updated_at: new Date('2026-10-10T00:00:00Z')
    }
  ],
  invoices: [
    {
      id: 'inv_001',
      user_id: 'usr_cust_001',
      subscription_id: 'sub_001',
      invoice_number: 'INV-2026-001',
      amount: 149.00,
      due_date: '2026-10-15',
      status: 'Paid',
      created_at: new Date('2026-10-01T00:00:00Z')
    },
    {
      id: 'inv_002',
      user_id: 'usr_cust_001',
      subscription_id: 'sub_001',
      invoice_number: 'INV-2026-002',
      amount: 149.00,
      due_date: '2026-11-15',
      status: 'Unpaid',
      created_at: new Date('2026-10-25T00:00:00Z')
    },
    {
      id: 'inv_003',
      user_id: 'usr_cust_002',
      subscription_id: 'sub_002',
      invoice_number: 'INV-2026-003',
      amount: 499.00,
      due_date: '2026-10-01',
      status: 'Paid',
      created_at: new Date('2026-09-25T00:00:00Z')
    },
    {
      id: 'inv_004',
      user_id: 'usr_cust_003',
      subscription_id: 'sub_003',
      invoice_number: 'INV-2026-004',
      amount: 49.00,
      due_date: '2026-10-10',
      status: 'Paid',
      created_at: new Date('2026-10-01T00:00:00Z')
    }
  ],
  payments: [
    {
      id: 'pmt_001',
      user_id: 'usr_cust_001',
      invoice_id: 'inv_001',
      amount: 149.00,
      payment_method: 'Credit Card',
      transaction_reference: 'tx_ref_acme_149_oct',
      status: 'succeeded',
      paid_at: new Date('2026-10-15T00:00:00Z'),
      created_at: new Date('2026-10-15T00:00:00Z')
    },
    {
      id: 'pmt_002',
      user_id: 'usr_cust_002',
      invoice_id: 'inv_003',
      amount: 499.00,
      payment_method: 'ACH Direct Debit',
      transaction_reference: 'tx_ref_nova_499_oct',
      status: 'succeeded',
      paid_at: new Date('2026-10-01T00:00:00Z'),
      created_at: new Date('2026-10-01T00:00:00Z')
    },
    {
      id: 'pmt_003',
      user_id: 'usr_cust_003',
      invoice_id: 'inv_004',
      amount: 49.00,
      payment_method: 'Credit Card',
      transaction_reference: 'tx_ref_quantum_49_oct',
      status: 'succeeded',
      paid_at: new Date('2026-10-10T00:00:00Z'),
      created_at: new Date('2026-10-10T00:00:00Z')
    }
  ],
  activity_logs: [
    {
      id: 'act_001',
      user_id: 'usr_admin_001',
      action: 'SYSTEM_INITIALIZED',
      description: 'Zylo Stream database schema and security parameters provisioned.',
      created_at: new Date('2026-01-01T00:00:00Z')
    },
    {
      id: 'act_002',
      user_id: 'usr_cust_001',
      action: 'SUBSCRIPTION_RENEWED',
      description: 'Subscription for Professional Autopilot auto-renewed for Acme Creative Studio.',
      created_at: new Date('2026-10-15T00:00:00Z')
    },
    {
      id: 'act_003',
      user_id: 'usr_cust_001',
      action: 'PAYMENT_CONFIRMED',
      description: 'Invoice INV-2026-001 settled ($149.00) via Credit Card.',
      created_at: new Date('2026-10-15T00:00:00Z')
    }
  ]
};

/**
 * Initialize the application database.
 * Supabase PostgreSQL is preferred when DATABASE_URL is configured.
 * MySQL remains available for local/backwards-compatible development.
 */
export async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    try {
      const { Pool } = await import('pg');
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: Number(process.env.DB_POOL_MAX || 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false }
      });
      await pool.query('SELECT 1');
      isMySqlConnected = true;
      console.log('[Database] Connected successfully to Supabase PostgreSQL.');
      return;
    } catch (err) {
      isMySqlConnected = false;
      if (pool) await pool.end().catch(() => {});
      pool = null;
      console.error('[Database] Supabase PostgreSQL connection failed:', err.message);
      throw err;
    }
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'zylo_stream';

  try {
    const adminConn = await mysql.createConnection({ host: dbHost, port: dbPort, user: dbUser, password: dbPassword });
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await adminConn.end();
    pool = mysql.createPool({
      host: dbHost, port: dbPort, user: dbUser, password: dbPassword, database: dbName,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0, decimalNumbers: true
    });
    const testConn = await pool.getConnection();
    testConn.release();
    isMySqlConnected = true;
    console.log(`[Database] Connected successfully to MySQL 8 database "${dbName}" at ${dbHost}:${dbPort}`);
    await createTablesIfNotExist();
  } catch (err) {
    isMySqlConnected = false;
    console.warn(`[Database] MySQL server not reachable (${err.code || err.message}).`);
    console.warn('[Database] Running in resilient embedded mode with seeded demo data.');
  }
}
/**
 * Creates tables in MySQL if connected
 */
async function createTablesIfNotExist() {
  if (!pool || !isMySqlConnected) return;

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NULL,
      google_id VARCHAR(255) NULL,
      role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
      company VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_email (email),
      INDEX idx_users_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS subscription_plans (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      price DECIMAL(10, 2) NOT NULL,
      billing_cycle VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      features JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_plans_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS subscriptions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      plan_id VARCHAR(36) NOT NULL,
      start_date DATE NOT NULL,
      next_billing_date DATE NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
      INDEX idx_subs_user (user_id),
      INDEX idx_subs_plan (plan_id),
      INDEX idx_subs_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      subscription_id VARCHAR(36) NULL,
      invoice_number VARCHAR(100) NOT NULL UNIQUE,
      amount DECIMAL(10, 2) NOT NULL,
      due_date DATE NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_invoices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_invoices_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
      INDEX idx_invoices_user (user_id),
      INDEX idx_invoices_sub (subscription_id),
      INDEX idx_invoices_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      invoice_id VARCHAR(36) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(100) NOT NULL DEFAULT 'Credit Card',
      transaction_reference VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'succeeded',
      paid_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_payments_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      INDEX idx_payments_user (user_id),
      INDEX idx_payments_invoice (invoice_id),
      INDEX idx_payments_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NULL,
      action VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_activity_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];

  for (const sql of tables) {
    try {
      await pool.query(sql);
    } catch (e) {
      console.error(`[Database] Error creating table:`, e.message);
    }
  }

  // Check if admin user exists; if not, seed default admin & plans
  try {
    const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM users');
    if (existing[0].cnt === 0) {
      console.log(`[Database] Auto-seeding initial users and plans into MySQL...`);
      for (const u of memoryStore.users) {
        await pool.query(
          'INSERT INTO users (id, name, email, password_hash, role, company, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [u.id, u.name, u.email, u.password_hash, u.role, u.company, u.created_at]
        );
      }
      for (const p of memoryStore.subscription_plans) {
        await pool.query(
          'INSERT INTO subscription_plans (id, name, description, price, billing_cycle, status, features, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [p.id, p.name, p.description, p.price, p.billing_cycle, p.status, JSON.stringify(p.features), p.created_at]
        );
      }
      for (const s of memoryStore.subscriptions) {
        await pool.query(
          'INSERT INTO subscriptions (id, user_id, plan_id, start_date, next_billing_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [s.id, s.user_id, s.plan_id, s.start_date, s.next_billing_date, s.status, s.created_at]
        );
      }
      for (const inv of memoryStore.invoices) {
        await pool.query(
          'INSERT INTO invoices (id, user_id, subscription_id, invoice_number, amount, due_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [inv.id, inv.user_id, inv.subscription_id, inv.invoice_number, inv.amount, inv.due_date, inv.status, inv.created_at]
        );
      }
      for (const pmt of memoryStore.payments) {
        await pool.query(
          'INSERT INTO payments (id, user_id, invoice_id, amount, payment_method, transaction_reference, status, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [pmt.id, pmt.user_id, pmt.invoice_id, pmt.amount, pmt.payment_method, pmt.transaction_reference, pmt.status, pmt.paid_at, pmt.created_at]
        );
      }
      for (const act of memoryStore.activity_logs) {
        await pool.query(
          'INSERT INTO activity_logs (id, user_id, action, description, created_at) VALUES (?, ?, ?, ?)',
          [act.id, act.user_id, act.action, act.description, act.created_at]
        );
      }
      console.log(`[Database] Auto-seeding completed.`);
    }
  } catch (err) {
    console.warn(`[Database] Auto-seeding check skipped:`, err.message);
  }
}

/**
 * Universal Database Interface: Executes parameterized queries on MySQL if connected,
 * or handles operations on the local memory store.
 */
function toPostgresSql(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => '$' + (++index));
}

/**
 * Shared database adapter. Existing controllers keep their parameterized `?`
 * placeholders while PostgreSQL receives native `$1`, `$2`, ... parameters.
 */
export const db = {
  isMySql() { return isMySqlConnected; },
  isConnected() { return isMySqlConnected; },
  getPool() { return pool; },
  getMemoryStore() { return memoryStore; },
  async query(sql, params = []) {
    if (isMySqlConnected && pool) {
      if (process.env.DATABASE_URL) {
        const result = await pool.query(toPostgresSql(sql), params);
        return result.rows;
      }
      const [rows] = await pool.query(sql, params);
      return rows;
    }
    return executeInMemory(sql, params);
  },
  async execute(sql, params = []) {
    if (isMySqlConnected && pool) {
      if (process.env.DATABASE_URL) {
        const result = await pool.query(toPostgresSql(sql), params);
        return { affectedRows: result.rowCount, rowCount: result.rowCount };
      }
      const [result] = await pool.execute(sql, params);
      return result;
    }
    return executeInMemory(sql, params);
  },
  async transaction(callback) {
    if (isMySqlConnected && pool) {
      if (process.env.DATABASE_URL) {
        const client = await pool.connect();
        const connection = {
          query: async (sql, params = []) => (await client.query(toPostgresSql(sql), params)).rows,
          execute: async (sql, params = []) => {
            const result = await client.query(toPostgresSql(sql), params);
            return { affectedRows: result.rowCount, rowCount: result.rowCount };
          }
        };
        try {
          await client.query('BEGIN');
          const result = await callback(connection);
          await client.query('COMMIT');
          return result;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally { client.release(); }
      }
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const result = await callback(conn);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally { conn.release(); }
    }
    return callback({
      query: async (sql, params) => executeInMemory(sql, params),
      execute: async (sql, params) => executeInMemory(sql, params)
    });
  }
};
/**
 * Lightweight SQL query parser for memory fallback
 */
function executeInMemory(sql, params) {
  const cleanSql = sql.trim();
  const lowerSql = cleanSql.toLowerCase();

  // 1. SELECT queries
  if (lowerSql.startsWith('select')) {
    // USERS by email
    if (lowerSql.includes('from users') && lowerSql.includes('where email =')) {
      const email = params[0];
      return memoryStore.users.filter((u) => u.email.toLowerCase() === email.toLowerCase());
    }
    // USERS by ID
    if (lowerSql.includes('from users') && lowerSql.includes('where id =')) {
      const id = params[0];
      return memoryStore.users.filter((u) => u.id === id);
    }
    // ALL USERS
    if (lowerSql.includes('from users')) {
      return memoryStore.users.map(({ password_hash, ...rest }) => rest);
    }
    // PLANS
    if (lowerSql.includes('from subscription_plans')) {
      if (lowerSql.includes('where status =')) {
        const targetStatus = params[0] || (lowerSql.includes("'active'") || lowerSql.includes('"active"') ? 'active' : 'active');
        return memoryStore.subscription_plans.filter((p) => p.status === targetStatus);
      }
      if (lowerSql.includes('where id =')) {
        return memoryStore.subscription_plans.filter((p) => p.id === params[0]);
      }
      return memoryStore.subscription_plans;
    }
    // SUBSCRIPTIONS by id and user_id
    if (lowerSql.includes('from subscriptions') && lowerSql.includes('where id =') && lowerSql.includes('user_id =')) {
      const subId = params[0];
      const userId = params[1];
      return memoryStore.subscriptions.filter((s) => s.id === subId && s.user_id === userId);
    }
    // SUBSCRIPTIONS by user_id
    if (lowerSql.includes('from subscriptions') && lowerSql.includes('where user_id =')) {
      const userId = params[0];
      return memoryStore.subscriptions
        .filter((s) => s.user_id === userId)
        .map((sub) => {
          const plan = memoryStore.subscription_plans.find((p) => p.id === sub.plan_id);
          return {
            ...sub,
            plan_name: plan?.name,
            plan_price: plan?.price,
            billing_cycle: plan?.billing_cycle
          };
        });
    }
    // ALL SUBSCRIPTIONS
    if (lowerSql.includes('from subscriptions')) {
      return memoryStore.subscriptions.map((sub) => {
        const user = memoryStore.users.find((u) => u.id === sub.user_id);
        const plan = memoryStore.subscription_plans.find((p) => p.id === sub.plan_id);
        return {
          ...sub,
          customer_name: user?.name,
          customer_email: user?.email,
          customer_company: user?.company,
          plan_name: plan?.name,
          plan_price: plan?.price,
          billing_cycle: plan?.billing_cycle
        };
      });
    }
    // INVOICES by id and user_id
    if (lowerSql.includes('from invoices') && lowerSql.includes('where id =') && lowerSql.includes('user_id =')) {
      const invId = params[0];
      const userId = params[1];
      return memoryStore.invoices.filter((inv) => inv.id === invId && inv.user_id === userId);
    }
    // INVOICES by user_id
    if (lowerSql.includes('from invoices') && lowerSql.includes('where user_id =')) {
      const userId = params[0];
      return memoryStore.invoices.filter((inv) => inv.user_id === userId);
    }
    // ALL INVOICES
    if (lowerSql.includes('from invoices')) {
      return memoryStore.invoices.map((inv) => {
        const user = memoryStore.users.find((u) => u.id === inv.user_id);
        return {
          ...inv,
          customer_name: user?.name,
          customer_email: user?.email,
          customer_company: user?.company
        };
      });
    }
    // PAYMENTS by user_id
    if (lowerSql.includes('from payments') && lowerSql.includes('where user_id =')) {
      const userId = params[0];
      return memoryStore.payments.filter((p) => p.user_id === userId);
    }
    // ALL PAYMENTS
    if (lowerSql.includes('from payments')) {
      return memoryStore.payments.map((pmt) => {
        const user = memoryStore.users.find((u) => u.id === pmt.user_id);
        return {
          ...pmt,
          customer_name: user?.name,
          customer_email: user?.email
        };
      });
    }
    // ACTIVITY LOGS
    if (lowerSql.includes('from activity_logs')) {
      return memoryStore.activity_logs;
    }
    return [];
  }

  // 2. INSERT queries
  if (lowerSql.startsWith('insert into users')) {
    const newUser = {
      id: params[0],
      name: params[1],
      email: params[2],
      password_hash: params[3],
      role: params[4] || 'customer',
      company: params[5] || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryStore.users.push(newUser);
    return { insertId: newUser.id, affectedRows: 1 };
  }

  if (lowerSql.startsWith('insert into subscriptions')) {
    const newSub = {
      id: params[0],
      user_id: params[1],
      plan_id: params[2],
      start_date: params[3],
      next_billing_date: params[4],
      status: params[5] || 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryStore.subscriptions.push(newSub);
    return { insertId: newSub.id, affectedRows: 1 };
  }

  if (lowerSql.startsWith('insert into invoices')) {
    const newInv = {
      id: params[0],
      user_id: params[1],
      subscription_id: params[2],
      invoice_number: params[3],
      amount: parseFloat(params[4]),
      due_date: params[5],
      status: params[6] || 'Unpaid',
      created_at: new Date()
    };
    memoryStore.invoices.push(newInv);
    return { insertId: newInv.id, affectedRows: 1 };
  }

  if (lowerSql.startsWith('insert into payments')) {
    const newPmt = {
      id: params[0],
      user_id: params[1],
      invoice_id: params[2],
      amount: parseFloat(params[3]),
      payment_method: params[4] || 'Credit Card',
      transaction_reference: params[5],
      status: params[6] || 'succeeded',
      paid_at: new Date(),
      created_at: new Date()
    };
    memoryStore.payments.push(newPmt);
    return { insertId: newPmt.id, affectedRows: 1 };
  }

  if (lowerSql.startsWith('insert into subscription_plans')) {
    const newPlan = {
      id: params[0],
      name: params[1],
      description: params[2],
      price: parseFloat(params[3]),
      billing_cycle: params[4],
      features: typeof params[5] === 'string' ? JSON.parse(params[5]) : (params[5] || []),
      status: params[6] || 'active',
      created_at: new Date()
    };
    memoryStore.subscription_plans.push(newPlan);
    return { insertId: newPlan.id, affectedRows: 1 };
  }

  if (lowerSql.startsWith('insert into activity_logs')) {
    const newLog = {
      id: params[0] || crypto.randomUUID(),
      user_id: params[1],
      action: params[2],
      description: params[3],
      created_at: new Date()
    };
    memoryStore.activity_logs.unshift(newLog);
    return { insertId: newLog.id, affectedRows: 1 };
  }

  // 3. UPDATE queries
  if (lowerSql.startsWith('update subscriptions set status =')) {
    const status = params[0];
    const id = params[1];
    const sub = memoryStore.subscriptions.find((s) => s.id === id);
    if (sub) {
      sub.status = status;
      sub.updated_at = new Date();
    }
    return { affectedRows: sub ? 1 : 0 };
  }

  if (lowerSql.startsWith('update invoices set status =')) {
    const status = params[0];
    const id = params[1];
    const inv = memoryStore.invoices.find((i) => i.id === id);
    if (inv) {
      inv.status = status;
    }
    return { affectedRows: inv ? 1 : 0 };
  }

  if (lowerSql.startsWith('update users set')) {
    const id = params[params.length - 1];
    const user = memoryStore.users.find((u) => u.id === id);
    if (user) {
      if (lowerSql.includes('name =')) user.name = params[0];
      if (lowerSql.includes('company =')) user.company = params[1];
      user.updated_at = new Date();
    }
    return { affectedRows: user ? 1 : 0 };
  }

  return { affectedRows: 0 };
}
