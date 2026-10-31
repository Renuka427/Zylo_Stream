-- Zylo_Stream core schema for Supabase PostgreSQL.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text,
  google_id text,
  role text not null default 'customer' check (role in ('customer','admin')),
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id text primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  billing_cycle text not null,
  status text not null default 'active',
  features jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  plan_id text not null references public.subscription_plans(id),
  start_date date not null,
  next_billing_date date not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  subscription_id text references public.subscriptions(id) on delete set null,
  invoice_number text not null unique,
  amount numeric(10,2) not null check (amount >= 0),
  due_date date not null,
  status text not null default 'Unpaid',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  invoice_id text not null references public.invoices(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  payment_method text not null default 'Credit Card',
  transaction_reference text not null,
  status text not null default 'succeeded',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id text primary key,
  user_id text references public.users(id) on delete set null,
  action text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_plans_status_price on public.subscription_plans(status, price);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan on public.subscriptions(plan_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_invoices_user on public.invoices(user_id);
create index if not exists idx_invoices_subscription on public.invoices(subscription_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_activity_logs_user on public.activity_logs(user_id);

alter table public.users enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;

revoke all on public.users, public.subscription_plans, public.subscriptions,
  public.invoices, public.payments, public.activity_logs from anon, authenticated;
grant all on public.users, public.subscription_plans, public.subscriptions,
  public.invoices, public.payments, public.activity_logs to service_role;
