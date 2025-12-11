-- Create blueprints table for storing form submissions
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Identity section
  business_name TEXT NOT NULL,
  one_liner TEXT,
  what_you_sell TEXT,
  brand_personality TEXT[],

  -- Vision section
  main_goal TEXT,
  primary_action TEXT,
  visitor_feel TEXT,
  dream_client TEXT,

  -- Look section (stored as JSONB for flexibility)
  "references" JSONB DEFAULT '[]'::jsonb,
  color_preference TEXT[],
  imagery_vibe TEXT[],
  assets_note TEXT,
  asset_uploads TEXT[],

  -- Content section
  pages TEXT[],
  cta_destination TEXT,
  home_copy TEXT,

  -- Technical section
  domain_status TEXT,
  integrations TEXT[],
  current_site TEXT,

  -- Confirmations
  timeline_confirmed BOOLEAN DEFAULT false,
  cancellation_confirmed BOOLEAN DEFAULT false,
  sla_confirmed BOOLEAN DEFAULT false,

  -- Full form data as backup (entire JSON)
  full_data JSONB NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_blueprints_created_at ON blueprints(created_at DESC);

-- Create index on business_name for search
CREATE INDEX IF NOT EXISTS idx_blueprints_business_name ON blueprints(business_name);

-- Enable Row Level Security
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything
CREATE POLICY "Service role can manage blueprints" ON blueprints
  FOR ALL
  USING (auth.role() = 'service_role');


-- Policy: Admins can view all blueprints
CREATE POLICY "Admins can view blueprints" ON blueprints
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
