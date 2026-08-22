-- Flyway V3: Budget Schema
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    limit_amount NUMERIC(12, 2) NOT NULL CHECK (limit_amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_period_dates CHECK (period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period_start, period_end);
