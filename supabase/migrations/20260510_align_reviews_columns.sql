-- Align reviews table columns to match lib/types.ts Review type
-- Run this in the Supabase SQL editor (dashboard.supabase.com → SQL Editor)

ALTER TABLE reviews RENAME COLUMN reviewer_name TO author_name;
ALTER TABLE reviews RENAME COLUMN verified TO verified_purchase;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS token_used text;
