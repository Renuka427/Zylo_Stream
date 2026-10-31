# Subscription Management System

> Scalable, enterprise-grade SaaS subscription and recurring billing management platform built for hackathons and production evolution.

---

## 1. Technology Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, Framer Motion, React Router, Recharts, Lucide Icons
- **Backend**: Node.js + Express.js (Domain-driven modular architecture)
- **Database**: PostgreSQL hosted on Supabase
- **Authentication**: Supabase Auth (JWT verification middleware)
- **Design System**: Cherry Red + Champagne
- **Version Control**: Git & GitHub (Optimized for 4-developer concurrent workflows)

---

## 2. Monorepo Directory Architecture

```
subscription-management-system/
├── backend/                  # Express.js REST API service
│   ├── src/
│   │   ├── config/           # Database & Supabase clients
│   │   ├── middleware/       # Auth, error handling, validation
│   │   ├── modules/          # Domain feature modules (isolated for multi-dev)
│   │   │   ├── users/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   ├── plans/
│   │   │   ├── subscriptions/
│   │   │   ├── quotations/
│   │   │   ├── invoices/
│   │   │   ├── payments/
│   │   │   ├── discounts/
│   │   │   └── reports/
│   │   ├── services/         # Billing, invoicing, renewals, emails
│   │   ├── jobs/             # Scheduled recurring billing runners
│   │   ├── utils/            # Standard response envelopes & logger
│   │   ├── app.js            # Express app configuration & route registry
│   │   └── server.js         # HTTP server entry point
│   ├── .env.example
│   └── package.json
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── assets/           # Media & brand assets
│   │   ├── components/       # ui/, layout/, charts/, common/
│   │   ├── layouts/          # Dashboard & authentication layouts
│   │   ├── pages/            # Feature pages (customers, plans, invoices, etc.)
│   │   ├── services/         # API client & Supabase client
│   │   ├── hooks/            # Reusable React hooks
│   │   ├── contexts/         # Shared state providers
│   │   ├── routes/           # React Router route registry
│   │   ├── utils/            # Frontend utility functions
│   │   ├── constants/        # System constants & enum mappings
│   │   ├── styles/           # Global styles and theme.css tokens
│   │   ├── App.jsx           # Root scaffold validation component
│   │   ├── main.jsx          # React DOM entry point
│   │   └── index.css         # Tailwind & theme layer directives
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── database/                 # PostgreSQL migrations & baseline schema
│   ├── migrations/           # Versioned forward SQL scripts
│   ├── seeds/                # Demo datasets
│   ├── schema.sql            # Aggregated schema baseline
│   └── README.md
├── docs/                     # Architectural & API specifications
│   ├── architecture.md
│   ├── api-documentation.md
│   └── database-design.md
├── .env.example              # Root environment template
├── .gitignore                # Global git ignore rules
├── package.json              # Root workspace orchestrator scripts
└── README.md
```

---

## 3. Design System: Cherry Red + Champagne

| Token Name | Hex Code | Utility / Tailwind Class | Role |
| :--- | :--- | :--- | :--- |
| **Champagne background** | `#F5E9D5` | `bg-champagne` / `--color-champagne-bg` | Main application background |
| **Ivory cards** | `#FFFAF2` | `bg-ivory` / `--color-ivory-card` | Content cards & elevated surfaces |
| **Cherry red** | `#C41E3A` | `bg-cherry`, `text-cherry` / `--color-cherry-red` | Primary brand accent & CTAs |
| **Dark cherry** | `#791D32` | `bg-cherry-dark`, `text-cherry-dark` | Hero headings & active states |
| **Champagne gold** | `#D6B779` | `text-champagne-gold` / `--color-champagne-gold` | Secondary accents & badges |
| **Espresso text** | `#292321` | `text-espresso` / `--color-espresso-text` | Primary body typography |
| **Warm stone borders** | `#E5D4B8` | `border-stone-warm` / `--color-warm-stone` | Card & table divider borders |

**Typography**:
- Interface Text: **Inter**
- Headings & Editorial Accents: **Playfair Display** (`font-display`)

---

## 4. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Installation
Run from the root directory:
```bash
# 1. Install root dependencies (concurrently)
npm install

# 2. Install all sub-project dependencies
npm run install:all
```

### Environment Configuration
Copy environment files for each app:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Running Locally
To run both backend and frontend concurrently from root:
```bash
npm run dev
```

Or run each service independently:
```bash
# Run backend only (runs on http://localhost:5000)
npm run dev:backend

# Run frontend only (runs on http://localhost:5173)
npm run dev:frontend
```

### Healthcheck Verification
- Backend Health: `http://localhost:5000/api/health`
- Frontend UI: `http://localhost:5173`

---

## 5. Team Workflow & Branching Strategy (4 Developers)

To prevent merge conflicts and maintain high velocity during the hackathon:

1. **Feature Ownership by Module**:
   - **Dev 1**: Subscriptions & Plans (`backend/src/modules/subscriptions`, `plans`, `frontend/src/pages/subscriptions`, `plans`)
   - **Dev 2**: Customers & Quotations (`backend/src/modules/customers`, `quotations`, `frontend/src/pages/customers`, `quotations`)
   - **Dev 3**: Invoices, Payments & Billing Jobs (`backend/src/modules/invoices`, `payments`, `jobs`, `frontend/src/pages/invoices`, `payments`)
   - **Dev 4**: Auth, Reports & Dashboard UI (`backend/src/modules/users`, `reports`, `frontend/src/pages/dashboard`, `reports`, `components/charts`)

2. **Branching Convention**:
   - `main`: Protected production branch.
   - `develop`: Shared integration branch.
   - `feat/<module-name>`: e.g. `feat/subscription-lifecycle`, `feat/invoice-pdf`.
