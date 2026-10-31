# Backend - Subscription Management System API

Express.js REST API service modularized by business domains, integrated with Supabase PostgreSQL and Auth.

## Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in Supabase credentials:
   ```bash
   cp .env.example .env
   ```
3. **Run in Development**:
   ```bash
   npm run dev
   ```
4. **Health Check Verification**:
   Navigate to `http://localhost:5000/api/health` in your browser or run:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Modular Architecture
Each feature inside `src/modules/` is self-contained:
- `<feature>.routes.js`: Route definitions and middleware binding.
- `<feature>.controller.js`: Request handling, validation, and response mapping.
- `<feature>.service.js`: Database queries and core domain logic.
- `<feature>.schema.js`: Payload validation schemas.
