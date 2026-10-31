-- ==============================================================================
-- ZYLO STREAM: Seed Data for Initial Demonstrations
-- ==============================================================================

USE zylo_stream;

-- Disable foreign key checks for clean idempotent re-seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE payments;
TRUNCATE TABLE invoices;
TRUNCATE TABLE subscriptions;
TRUNCATE TABLE subscription_plans;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Initial Users (Passwords hashed with bcrypt: salt rounds 10)
-- admin@zylostream.io -> Admin@Zylo2026!
-- eleanor.vance@acmestudio.io -> Customer@Zylo2026!
INSERT INTO users (id, name, email, password_hash, role, company, created_at) VALUES
('usr_admin_001', 'Julian Sterling', 'admin@zylostream.io', '$2b$10$O4Z8/B10uH6pW5dGyxH/Te9pI7HkI2tQ.75cFsUv9NlT2Wn3Cqfvy', 'admin', 'Zylo Stream Executive', NOW()),
('usr_cust_001', 'Eleanor Vance', 'eleanor.vance@acmestudio.io', '$2b$10$O4Z8/B10uH6pW5dGyxH/Te9pI7HkI2tQ.75cFsUv9NlT2Wn3Cqfvy', 'customer', 'Acme Creative Studio', NOW()),
('usr_cust_002', 'Marcus Vance', 'marcus.v@novatech.co', '$2b$10$O4Z8/B10uH6pW5dGyxH/Te9pI7HkI2tQ.75cFsUv9NlT2Wn3Cqfvy', 'customer', 'NovaTech Solutions', NOW()),
('usr_cust_003', 'Dr. Sophia Reyes', 's.reyes@quantumhealth.org', '$2b$10$O4Z8/B10uH6pW5dGyxH/Te9pI7HkI2tQ.75cFsUv9NlT2Wn3Cqfvy', 'customer', 'Quantum Health Systems', NOW());

-- 2. Insert Subscription Plans
INSERT INTO subscription_plans (id, name, description, price, billing_cycle, status, features, created_at) VALUES
('plan_starter_monthly', 'Starter Ledger', 'Essential recurring billing for growing teams and boutique agencies.', 49.00, 'monthly', 'active', '["Up to 25 Active Subscriptions", "Automated Dunning Emails", "Basic Financial Export", "Community Support"]', NOW()),
('plan_pro_monthly', 'Professional Autopilot', 'Comprehensive recurring revenue operations for scaling SaaS.', 149.00, 'monthly', 'active', '["Up to 250 Active Subscriptions", "Full Invoicing & Dunning Engine", "Real-time Webhook Triggers", "Priority Audit Support", "Custom Branding"]', NOW()),
('plan_enterprise_monthly', 'Enterprise Sovereign', 'Bespoke high-volume treasury orchestration with SLA guarantees.', 499.00, 'monthly', 'active', '["Unlimited Subscriptions", "Dedicated Account Orchestrator", "Multi-Entity Consolidated Ledger", "Custom Accounting Integrations", "99.99% Uptime SLA"]', NOW()),
('plan_annual_sovereign', 'Annual Sovereign', 'Full annual subscription with 2 months complimentary access.', 3990.00, 'yearly', 'active', '["All Enterprise Capabilities Included", "Quarterly Financial Health Reviews", "Bespoke Contract Review", "White-glove Migration"]', NOW());

-- 3. Insert Subscriptions
INSERT INTO subscriptions (id, user_id, plan_id, start_date, next_billing_date, status, created_at) VALUES
('sub_001', 'usr_cust_001', 'plan_pro_monthly', '2026-01-15', '2026-11-15', 'active', NOW()),
('sub_002', 'usr_cust_002', 'plan_enterprise_monthly', '2026-02-01', '2026-11-01', 'active', NOW()),
('sub_003', 'usr_cust_003', 'plan_starter_monthly', '2026-03-10', '2026-11-10', 'active', NOW());

-- 4. Insert Invoices
INSERT INTO invoices (id, user_id, subscription_id, invoice_number, amount, due_date, status, created_at) VALUES
('inv_001', 'usr_cust_001', 'sub_001', 'INV-2026-001', 149.00, '2026-10-15', 'Paid', NOW()),
('inv_002', 'usr_cust_001', 'sub_001', 'INV-2026-002', 149.00, '2026-11-15', 'Unpaid', NOW()),
('inv_003', 'usr_cust_002', 'sub_002', 'INV-2026-003', 499.00, '2026-10-01', 'Paid', NOW()),
('inv_004', 'usr_cust_003', 'sub_003', 'INV-2026-004', 49.00, '2026-10-10', 'Paid', NOW());

-- 5. Insert Payments
INSERT INTO payments (id, user_id, invoice_id, amount, payment_method, transaction_reference, status, paid_at, created_at) VALUES
('pmt_001', 'usr_cust_001', 'inv_001', 149.00, 'Credit Card', 'tx_ref_acme_149_oct', 'succeeded', NOW(), NOW()),
('pmt_002', 'usr_cust_002', 'inv_003', 499.00, 'ACH Direct Debit', 'tx_ref_nova_499_oct', 'succeeded', NOW(), NOW()),
('pmt_003', 'usr_cust_003', 'inv_004', 49.00, 'Credit Card', 'tx_ref_quantum_49_oct', 'succeeded', NOW(), NOW());

-- 6. Insert Activity Logs
INSERT INTO activity_logs (id, user_id, action, description, created_at) VALUES
('act_001', 'usr_admin_001', 'SYSTEM_INITIALIZED', 'Zylo Stream database schema and security parameters provisioned.', NOW()),
('act_002', 'usr_cust_001', 'SUBSCRIPTION_RENEWED', 'Subscription for Professional Autopilot auto-renewed for Acme Creative Studio.', NOW()),
('act_003', 'usr_cust_001', 'PAYMENT_CONFIRMED', 'Invoice INV-2026-001 settled ($149.00) via Credit Card.', NOW());
