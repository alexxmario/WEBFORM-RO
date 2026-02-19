-- Add phone_number field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT DEFAULT NULL;
