-- =====================================================
-- Verify Bundles Table Setup
-- =====================================================
-- Run this in Supabase SQL Editor to diagnose the 404 error
-- =====================================================

-- 1. Check if bundles table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'bundles';

-- 2. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'bundles'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'bundles';

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'bundles';

-- 5. Count bundles by network
SELECT 
  network,
  count(*) as total,
  count(*) FILTER (WHERE is_active = true) as active
FROM bundles
GROUP BY network
ORDER BY network;

-- 6. Test public access (should return rows)
SELECT 
  id,
  network,
  display_name,
  price_ghc,
  is_active
FROM bundles
WHERE network = 'AT_ISHARE'
  AND is_active = true
LIMIT 5;

-- =====================================================
-- If bundles table doesn't exist, you need to run:
-- supabase-schema.sql
-- =====================================================

-- =====================================================
-- If RLS is blocking, run this to fix:
-- =====================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active bundles" ON bundles;

-- Recreate the policy
CREATE POLICY "Public can view active bundles" 
  ON bundles FOR SELECT 
  USING (is_active = true);

-- Verify the policy was created
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'bundles';

