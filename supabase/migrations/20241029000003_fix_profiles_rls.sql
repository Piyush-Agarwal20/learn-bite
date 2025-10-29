-- Migration: Fix profiles RLS policies
-- Created: 2025-10-29
-- Description: Add INSERT policy so users can create their own profile during signup

-- Add INSERT policy for profiles table
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Comment to document the policy
COMMENT ON POLICY "Users can insert own profile" ON profiles IS
'Allows authenticated users to insert their own profile record during signup';
