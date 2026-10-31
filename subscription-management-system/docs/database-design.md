# Database Design & Data Modeling

## Overview
This document contains the conceptual, logical, and physical entity-relationship design for the **Subscription Management System**, targeting PostgreSQL hosted via Supabase.

## Planned Core Entities
- **Users**: Admin, finance, and account managers authenticated through Supabase Auth.
- **Customers / Organizations**: Subscriber entities with billing contact info and payment methods.
- **Products**: Billable software products or services.
- **Plans**: Tiered or usage-based pricing schemes (monthly, quarterly, annual, custom).
- **Subscriptions**: Active, paused, past-due, or cancelled agreements linking Customers to Plans.
- **Quotations**: Pre-subscription proposals and custom pricing estimates.
- **Invoices**: Generated billing records with line items, tax breakdowns, and payment statuses.
- **Payments**: Transaction receipts, refunds, and gateway references.
- **Discounts**: Coupons, promotional codes, and custom fixed/percentage deductions.
- **Audit Logs / Events**: Immutable record of subscription lifecycle transitions and billing executions.

## Entity Relationship Diagram (To be designed)
```
[Customer] 1 --- * [Subscription] * --- 1 [Plan] * --- 1 [Product]
    |                      |
    |                      *
    1                     [Invoice] 1 --- * [Payment]
    |                      |
    *                      *
[Quotation]           [InvoiceLineItem]
```

## Security & Row Level Security (RLS)
Supabase RLS policies will be defined in `database/migrations/` to guarantee multi-tenant tenant isolation and role-based permissions.
