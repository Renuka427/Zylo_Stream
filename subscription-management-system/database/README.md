# Database Management

This directory manages database migrations, seed data, and schema definitions for the PostgreSQL database hosted on **Supabase**.

## Directory Layout
- `migrations/`: Versioned SQL migration files (e.g., `001_initial_schema.sql`, `002_add_invoices.sql`).
- `seeds/`: Development and testing seed scripts with demo products, mock plans, and sample subscriptions.
- `schema.sql`: Aggregated baseline database schema reference.

## Migration Workflow
1. Write forward migrations in `migrations/` numbered sequentially.
2. Apply migrations through the Supabase Dashboard SQL Editor or Supabase CLI:
   ```bash
   npx supabase db push
   # or run specific SQL migration scripts
   ```
3. Test seed scripts in local/staging environments:
   ```bash
   npx supabase db reset --seed
   ```

## Note
Do not modify already applied migration files in team environments; always create a new incremental migration file to keep all 4 developers in sync.
