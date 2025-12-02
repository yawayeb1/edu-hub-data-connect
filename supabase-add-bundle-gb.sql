-- =====================================================
-- Add bundle_gb column to orders table
-- =====================================================
-- This extracts the GB amount from the package field
-- Example: "10 GB" -> 10.00
-- =====================================================

-- Add bundle_gb column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS bundle_gb numeric(8,2) 
GENERATED ALWAYS AS (
  CAST(
    NULLIF(
      REGEXP_REPLACE(
        SPLIT_PART(package, ' ', 1),
        '[^0-9.]',
        '',
        'g'
      ),
      ''
    ) AS numeric
  )
) STORED;

-- Add comment
COMMENT ON COLUMN orders.bundle_gb IS 'Extracted GB amount from package field (e.g., "10 GB" -> 10.00)';

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_generated,
  generation_expression
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name = 'bundle_gb';

