# Zylo Stream: Backend Service

Node.js + Express.js backend engine for **Zylo Stream**, powered by MySQL 8, JWT-based RBAC authentication, and rate-limited endpoints.

## 1. Technologies & Architecture
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL 8 via `mysql2/promise` with automatic table provisioning and resilient in-memory fallback
- **Security**: `helmet`, `cors`, `express-rate-limit`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`
- **Validation**: `zod` for request payload sanitization and boundary enforcement

---

## 2. Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool & memory fallback
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification & RBAC requireRole
│   │   ├── error.middleware.js  # Global centralized error handler
│   │   └── validate.middleware.js # Zod validation schemas
│   ├── modules/
│   │   ├── auth/                # Register, login, admin-login, me, profile, logout
│   │   ├── plans/               # Public subscription catalog
│   │   ├── customer/            # Subscriptions, invoices, payments, stats
│   │   └── admin/               # Executive overview, customer directory, audit
│   ├── scripts/
│   │   ├── initDb.js            # Automated MySQL 8 schema & seed runner
│   │   └── createAdmin.js       # Safe CLI administrator creation/promotion
│   ├── app.js                   # Express app configuration & middleware
│   └── server.js                # Server entry point
├── test_api_integration.js      # Automated 20-point API integration test suite
├── .env.example                 # Environment configuration template
└── package.json
```

---

## 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration parameters:
- `PORT`: HTTP port (default `5000`)
- `CLIENT_URL`: Frontend origin for CORS and cookies (default `http://localhost:5173`)
- `DB_HOST`: MySQL host (`localhost`)
- `DB_PORT`: MySQL port (`3306`)
- `DB_USER`: MySQL user (`root`)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (`zylo_stream`)
- `JWT_SECRET`: Secret key for signing authorization tokens

---

## 4. Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Initialize database schema & seeds
npm run db:init

# 3. Create or promote an administrator
npm run admin:create admin@zylostream.io admin-super-pass-2026 "Zylo Admin"

# 4. Start development server (with nodemon)
npm run dev

# 5. Run API integration tests
node test_api_integration.js
```
