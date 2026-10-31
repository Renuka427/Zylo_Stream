# Zylo Stream: Your Subscription, On Autopilot.

Enterprise-grade SaaS subscription management platform featuring a public 3D landing page, dedicated customer portal, executive administration overview, and a Node.js + Express + MySQL 8 backend.

---

## 1. System Architecture & Tech Stack

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS (Cherry Red `#C41E3A` + Champagne `#F5E9D5` luxury theme)
  - Three.js / Canvas 3D interactive hero
  - Framer Motion animations
  - React Router (Separate Customer `/customer/dashboard` and Admin `/admin/dashboard` routes)
  - Recharts for financial and MRR analytics
  - Lucide React icons
- **Backend**:
  - Node.js (ES Modules)
  - Express.js with domain-driven modular routing
  - MySQL 8 with `mysql2` parameterized queries & transactions
  - Helmet & CORS security middleware
  - Express Rate Limiting (brute-force protection on auth endpoints)
  - BCrypt password hashing & JWT tokens via HTTP-only cookies
  - Zod request validation
- **Database (`zylo_stream`)**:
  - `users`: ID, name, email, password_hash, google_id, role (`customer`, `admin`), company
  - `subscription_plans`: ID, name, description, price (DECIMAL), billing_cycle, status, features
  - `subscriptions`: ID, user_id, plan_id, start_date, next_billing_date, status
  - `invoices`: ID, user_id, subscription_id, invoice_number, amount (DECIMAL), due_date, status
  - `payments`: ID, user_id, invoice_id, amount (DECIMAL), payment_method, transaction_reference, status
  - `activity_logs`: ID, user_id, action, description, created_at

---

## 2. Directory Structure

```
subscription-management-system/
├── backend/                  # Express.js REST API service
│   ├── src/
│   │   ├── config/database.js  # MySQL connection pool with resilient in-memory fallback
│   │   ├── middleware/         # auth (JWT/RBAC), error, validate (Zod)
│   │   ├── modules/            # auth, plans, customer, admin
│   │   ├── scripts/            # initDb.js, createAdmin.js
│   │   ├── app.js
│   │   └── server.js
│   ├── test_api_integration.js # 20-point automated integration test suite
│   ├── .env.example
│   └── package.json
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/       # 3D canvas, UI controls, charts
│   │   ├── contexts/         # AuthContext, MockDataContext (live sync)
│   │   ├── pages/
│   │   │   ├── landing/      # Public 3D Landing Page (at '/')
│   │   │   ├── auth/         # Customer Login, Admin Login, Registration
│   │   │   ├── customer/     # Customer Dashboard & subscriptions
│   │   │   └── admin/        # Executive Overview & platform management
│   │   ├── services/api.js   # Centralized API client (Axios-compatible fetch)
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
├── database/                 # MySQL 8 database assets
│   ├── schema.sql            # Idempotent DDL schema for all 6 tables
│   ├── seeds/seed.sql        # Demo accounts, plans, subscriptions, invoices
│   └── README.md
├── docs/                     # Specifications
│   └── api-documentation.md  # Complete REST API specification
├── .env.example              # Monorepo environment configuration template
└── package.json              # Monorepo runner scripts
```

---

## 3. Quick Start & Setup Guide

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```

### Step 2: Configure Environment Variables
Copy `.env.example` templates:
```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```
Edit `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zylo_stream
```

### Step 3: Initialize Database (Schema & Seeds)
Run the automated initialization script:
```bash
npm run db:init
```
*(Or execute `database/schema.sql` and `database/seeds/seed.sql` directly into MySQL).*

### Step 4: Promote or Create an Administrator
```bash
npm run admin:create admin@zylostream.io admin-super-pass-2026 "Executive Admin"
```

### Step 5: Start Backend and Frontend
To run both simultaneously:
```bash
npm run dev
```
Or independently:
```bash
# Terminal 1: Backend (http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend (http://localhost:5173)
npm run dev:frontend
```

---

## 4. Default Demonstration Accounts

| Interface | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Portal** (`/admin/login`) | `admin@zylostream.io` | `admin-super-pass-2026` | `admin` |
| **Customer Portal** (`/login`) | `eleanor.vance@acmestudio.io` | `demo-customer-2026` | `customer` |

---

## 5. Verification & Testing

Run the automated 20-point backend integration test suite:
```bash
npm run test:backend
```
Verifies:
- Public catalog (`GET /api/plans`)
- Customer registration with enforced `customer` role
- Duplicate email rejection (409 Conflict)
- Customer login & password validation
- Admin login with server-side role check
- RBAC protection: Customer cannot access `/api/admin/*` (403 Forbidden)
- Customer ownership: Users only query their own subscriptions and invoices
- Transactional subscription creation + invoice generation
- Invoice payment settlement & transaction logging
- Session logout
