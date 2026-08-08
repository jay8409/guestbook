-- ============================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA FOR GUESTBOOK APP
-- ============================================================================

-- 1. Create Guestbook Entries Table
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  avatar TEXT DEFAULT '🚀',
  password_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Replies Table
CREATE TABLE IF NOT EXISTS replies (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Anonymous Access
-- Allow anyone to read entries
CREATE POLICY "Allow public read entries" ON entries FOR SELECT USING (true);

-- Allow anyone to insert entries
CREATE POLICY "Allow public insert entries" ON entries FOR INSERT WITH CHECK (true);

-- Allow public update entries (Password verification handled in app/logic)
CREATE POLICY "Allow public update entries" ON entries FOR UPDATE USING (true);

-- Allow public delete entries
CREATE POLICY "Allow public delete entries" ON entries FOR DELETE USING (true);

-- Allow public operations for replies
CREATE POLICY "Allow public read replies" ON replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert replies" ON replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update replies" ON replies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete replies" ON replies FOR DELETE USING (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE entries;
ALTER PUBLICATION supabase_realtime ADD TABLE replies;
