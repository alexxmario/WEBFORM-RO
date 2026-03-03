-- Add billing_info column to orders table for invoice generation
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_info JSONB DEFAULT NULL;

-- Comment for documentation
COMMENT ON COLUMN orders.billing_info IS 'Stores billing information (persoana fizica or persoana juridica) for invoice generation';
