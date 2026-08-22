# Spendora Database Schema & Migrations

This directory contains versioned SQL migrations for Spendora PostgreSQL database.

## Migration Structure

- `V1__initial_schema.sql`: Primary `expenses` entity with UUID primary keys and timestamps.
- `V2__search_filter_indexes.sql`: Optimizing indexes for category, date, amount, and title fields.
- `V3__budget_schema.sql`: `budgets` entity with date bounds and optional category scopes.

## Supabase Deployment Note

When deploying to **Supabase**, run migrations directly using Supabase's **Direct Connection** (Port 5432) rather than the pooled PgBouncer connection (Port 6543) to allow DDL execution.
