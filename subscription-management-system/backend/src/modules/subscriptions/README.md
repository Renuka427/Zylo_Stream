# Subscriptions Module

## Scope
Subscription lifecycle management (create, upgrade, downgrade, pause, cancel).

## Recommended Structure
- `subscriptions.routes.js`: Express router definitions
- `subscriptions.controller.js`: Request validation and HTTP response mapping
- `subscriptions.service.js`: Business logic and Supabase database interactions
- `subscriptions.schema.js`: Input validation schemas
