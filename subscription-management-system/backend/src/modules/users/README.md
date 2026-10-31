# Users Module

## Scope
User authentication, roles (Admin, Manager, Billing Ops), and profile management.

## Recommended Structure
- `users.routes.js`: Express router definitions
- `users.controller.js`: Request validation and HTTP response mapping
- `users.service.js`: Business logic and Supabase Auth interactions
- `users.schema.js`: Input validation schemas
