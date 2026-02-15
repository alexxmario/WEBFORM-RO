-- Add subscription fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS netopia_token TEXT DEFAULT NULL;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'RON',
    status TEXT NOT NULL DEFAULT 'pending',
    ntp_id TEXT,
    payment_token TEXT,
    error_code TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Add index for status
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Only server can insert/update orders (via service role)
CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant access to authenticated users for reading
GRANT SELECT ON orders TO authenticated;
