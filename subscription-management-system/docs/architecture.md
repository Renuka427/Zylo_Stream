# System Architecture

## Overview
This document outlines the high-level system architecture for the **Subscription Management System**, a full-stack SaaS platform designed for managing products, pricing plans, automated billing cycles, invoices, and customer subscriptions.

## Architecture Highlights
- **Monorepo Design**: Decoupled `frontend/` and `backend/` applications sharing database schemas and documentation.
- **Frontend Layer**: React 18 / Vite SPA styled with Tailwind CSS, animated with Framer Motion, and routed via React Router.
- **Backend Layer**: Node.js + Express REST API organized by domain modules (Users, Customers, Products, Plans, Subscriptions, Invoices, Payments, Discounts, Reports).
- **Data & Auth Layer**: PostgreSQL hosted on Supabase, leveraging Supabase Auth for JWT-based session security and Row Level Security (RLS) policies.
- **Asynchronous & Scheduled Tasks**: Cron-driven background jobs for recurring subscription renewals, proration calculations, and invoice dispatching.

## Module Interaction Diagram
```
[ Client Browser (React + Tailwind) ]
                |
                v
    [ Express API Gateway ]
       ├── Auth & Validation Middleware
       ├── Domain Modules (Subscriptions, Invoices, Customers...)
       └── Background Jobs (node-cron for recurring billing)
                |
                v
   [ Supabase PostgreSQL + Auth ]
```

## Detailed Sections (To be expanded)
- Component Hierarchy and State Flow
- Authentication & RBAC Policy Matrix
- Recurring Billing State Machine
- Error Handling and Logging Strategy
- Deployment & CI/CD Pipeline
