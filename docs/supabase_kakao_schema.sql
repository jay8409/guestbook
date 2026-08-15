-- ============================================================================
-- SUPABASE KAKAO SSO AUTHENTICATION DATABASE SCHEMA UPDATE
-- Supabase 대시보드 -> SQL Editor 에서 실행하여 카카오 로그인 유저 컬럼 및 RLS 권한을 설정합니다.
-- ============================================================================

-- 1. Add user_id Column to entries and replies tables
ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE replies ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Update RLS Policies for Kakao Authenticated Users
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Entries Policies
DROP POLICY IF EXISTS "Allow public read entries" ON entries;
DROP POLICY IF EXISTS "Allow authenticated insert entries" ON entries;
DROP POLICY IF EXISTS "Allow public insert entries" ON entries;
DROP POLICY IF EXISTS "Allow author update entries" ON entries;
DROP POLICY IF EXISTS "Allow public update entries" ON entries;
DROP POLICY IF EXISTS "Allow author delete entries" ON entries;
DROP POLICY IF EXISTS "Allow public delete entries" ON entries;

-- Read: Anyone can read entries
CREATE POLICY "Allow public read entries" ON entries FOR SELECT USING (true);

-- Insert: Anyone or Kakao Authenticated User can insert entries
CREATE POLICY "Allow public insert entries" ON entries FOR INSERT WITH CHECK (true);

-- Update: Author or public update entries
CREATE POLICY "Allow public update entries" ON entries FOR UPDATE USING (true);

-- Delete: Author or public delete entries
CREATE POLICY "Allow public delete entries" ON entries FOR DELETE USING (true);

-- Replies Policies
DROP POLICY IF EXISTS "Allow public read replies" ON replies;
DROP POLICY IF EXISTS "Allow public insert replies" ON replies;
DROP POLICY IF EXISTS "Allow public update replies" ON replies;
DROP POLICY IF EXISTS "Allow public delete replies" ON replies;

CREATE POLICY "Allow public read replies" ON replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert replies" ON replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update replies" ON replies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete replies" ON replies FOR DELETE USING (true);
