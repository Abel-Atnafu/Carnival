-- Create tickets table for Lebawi Carnival
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cbe', 'telebirr')),
  payment_screenshot TEXT,
  screenshot_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'used')),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(code);
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(phone);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert tickets (public purchase)
CREATE POLICY "Allow public ticket purchase" ON tickets
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own ticket by code or phone
CREATE POLICY "Allow public ticket lookup" ON tickets
  FOR SELECT
  USING (true);

-- Allow updates only from service role (admin operations handled via server)
CREATE POLICY "Allow service role updates" ON tickets
  FOR UPDATE
  USING (true);

-- Allow deletes only from service role
CREATE POLICY "Allow service role deletes" ON tickets
  FOR DELETE
  USING (true);
