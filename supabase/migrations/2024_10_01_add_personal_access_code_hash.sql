-- Migration: add personal_access_code_hash to profiles table
-- Adds a column to store a hashed personal access code for each user.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personal_access_code_hash TEXT;
