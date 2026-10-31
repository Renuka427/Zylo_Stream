# Zylo Stream: MySQL 8 Database Architecture

Relational database schema and seed data for the **Zylo Stream** Subscription Management SaaS platform.

## 1. Database Specifications
- **DBMS**: MySQL 8.0+
- **Database Name**: `zylo_stream`
- **Default Port**: `3306`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

## 2. Relational Schema Architecture

The database contains 6 relational tables with primary keys, foreign key constraints with cascade/set null rules, unique constraints, and high-performance indexes:

1. **`users`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `name VARCHAR(255) NOT NULL`
   - `email VARCHAR(255) NOT NULL UNIQUE`
   - `password_hash VARCHAR(255) NULL`
   - `google_id VARCHAR(255) NULL`
   - `role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer'`
   - `company VARCHAR(255) NULL`
   - `created_at TIMESTAMP`, `updated_at TIMESTAMP`

2. **`subscription_plans`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `name VARCHAR(255) NOT NULL`
   - `description TEXT NULL`
   - `price DECIMAL(10, 2) NOT NULL`
   - `billing_cycle VARCHAR(50) NOT NULL` (`'monthly'`, `'yearly'`, etc.)
   - `status VARCHAR(50) NOT NULL DEFAULT 'active'`
   - `features JSON NULL`
   - `created_at TIMESTAMP`

3. **`subscriptions`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `user_id VARCHAR(36) NOT NULL (FK -> users.id ON DELETE CASCADE)`
   - `plan_id VARCHAR(36) NOT NULL (FK -> subscription_plans.id)`
   - `start_date DATE NOT NULL`, `next_billing_date DATE NOT NULL`
   - `status VARCHAR(50) NOT NULL DEFAULT 'active'`
   - `created_at TIMESTAMP`, `updated_at TIMESTAMP`

4. **`invoices`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `user_id VARCHAR(36) NOT NULL (FK -> users.id ON DELETE CASCADE)`
   - `subscription_id VARCHAR(36) NULL (FK -> subscriptions.id ON DELETE SET NULL)`
   - `invoice_number VARCHAR(100) NOT NULL UNIQUE`
   - `amount DECIMAL(10, 2) NOT NULL`
   - `due_date DATE NOT NULL`
   - `status VARCHAR(50) NOT NULL DEFAULT 'Unpaid'`
   - `created_at TIMESTAMP`

5. **`payments`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `user_id VARCHAR(36) NOT NULL (FK -> users.id ON DELETE CASCADE)`
   - `invoice_id VARCHAR(36) NOT NULL (FK -> invoices.id ON DELETE CASCADE)`
   - `amount DECIMAL(10, 2) NOT NULL`
   - `payment_method VARCHAR(50) NOT NULL`
   - `transaction_reference VARCHAR(255) NOT NULL UNIQUE`
   - `status VARCHAR(50) NOT NULL DEFAULT 'succeeded'`
   - `paid_at TIMESTAMP NOT NULL`
   - `created_at TIMESTAMP`

6. **`activity_logs`**:
   - `id VARCHAR(36) PRIMARY KEY`
   - `user_id VARCHAR(36) NULL (FK -> users.id ON DELETE SET NULL)`
   - `action VARCHAR(100) NOT NULL`
   - `description TEXT NOT NULL`
   - `created_at TIMESTAMP`

---

## 3. Database Setup Commands

### Automated Node.js Initialization
From the project root:
```bash
npm run db:init
```
Or from the `backend/` directory:
```bash
npm run db:init
```
This automated runner:
1. Connects to MySQL using your `.env` credentials (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`).
2. Creates the `zylo_stream` database if it does not exist.
3. Executes `database/schema.sql` (idempotent table definitions).
4. Seeds the demo data from `database/seeds/seed.sql`.

### Direct MySQL CLI Setup
Alternatively, run the SQL scripts via the MySQL CLI client:
```bash
# 1. Create Schema
mysql -u root -p < database/schema.sql

# 2. Populate Seed Data (Optional)
mysql -u root -p zylo_stream < database/seeds/seed.sql
```

---

## 4. Default Seed Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@zylostream.io` | `admin-super-pass-2026` |
| **Customer** | `eleanor.vance@acmestudio.io` | `demo-customer-2026` |
| **Customer** | `marcus.v@novatech.co` | `demo-customer-2026` |

---

## 5. Administrator Promotion Tool
To promote any existing user or create a new authorized administrator securely:
```bash
npm run admin:create <email> [password] [name]
```
Example:
```bash
npm run admin:create alex.admin@zylostream.io StrongAdminPass2026! "Alex Executive"
```
