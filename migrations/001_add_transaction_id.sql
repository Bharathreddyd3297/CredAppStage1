-- =====================================================================
-- Migration 001: add transaction_id to payments
-- =====================================================================
-- Run this against the EXISTING credpay database if it was created before
-- transaction_id was added to schema.sql. Safe to re-run (IF NOT EXISTS).
--
--   psql -U postgres -d credpay -f migrations/001_add_transaction_id.sql
-- =====================================================================

ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(30);

-- Enforce uniqueness of transaction ids (skip if the constraint already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_payments_transaction_id'
    ) THEN
        ALTER TABLE payments
            ADD CONSTRAINT uq_payments_transaction_id UNIQUE (transaction_id);
    END IF;
END $$;
