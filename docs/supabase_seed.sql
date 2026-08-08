-- ============================================================================
-- SUPABASE FULL DATABASE SCHEMA & SEED DATA SCRIPT
-- Supabase 대시보드 -> SQL Editor 에 복사하여 Run 버튼을 누르면
-- 테이블 생성부터 샘플 데이터 입력까지 한 번에 완료됩니다.
-- ============================================================================

-- 1. 방명록 (entries) 테이블 생성
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

-- 2. 답글 (replies) 테이블 생성
CREATE TABLE IF NOT EXISTS replies (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) 익명 접근 정책 설정
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read entries" ON entries;
DROP POLICY IF EXISTS "Allow public insert entries" ON entries;
DROP POLICY IF EXISTS "Allow public update entries" ON entries;
DROP POLICY IF EXISTS "Allow public delete entries" ON entries;

CREATE POLICY "Allow public read entries" ON entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert entries" ON entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update entries" ON entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete entries" ON entries FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read replies" ON replies;
DROP POLICY IF EXISTS "Allow public insert replies" ON replies;
DROP POLICY IF EXISTS "Allow public update replies" ON replies;
DROP POLICY IF EXISTS "Allow public delete replies" ON replies;

CREATE POLICY "Allow public read replies" ON replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert replies" ON replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update replies" ON replies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete replies" ON replies FOR DELETE USING (true);

-- 4. 초기 샘플 방명록 및 답글 데이터 입력 (Seed Data)
INSERT INTO entries (id, author, avatar, password_hash, content, is_private, likes, created_at)
VALUES 
  (
    'entry-seed-1', 
    '민우', 
    '🎨', 
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    '우연히 방문했는데 글래스모피즘 디자인이 정말 세련되고 예쁘네요! Supabase DB 연동 기능도 지원되어 멋집니다 🎉', 
    false, 
    12, 
    NOW() - INTERVAL '5 hours'
  ),
  (
    'entry-seed-2', 
    '시크릿게스트', 
    '👾', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 
    '이 글은 비밀글입니다! 작성 시 설정한 비밀번호를 알고 계시다면 해제하여 내용을 확인하실 수 있습니다.', 
    true, 
    5, 
    NOW() - INTERVAL '1 day'
  ),
  (
    'entry-seed-3', 
    '개발자A', 
    '🚀', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 
    '1단계 답글 기능과 반응형 레이아웃이 매끄럽게 잘 동작하네요. 익명으로 자유롭게 소통할 수 있어 참 좋네요!', 
    false, 
    8, 
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO replies (id, entry_id, author, password_hash, content, created_at)
VALUES 
  (
    'reply-seed-1-1', 
    'entry-seed-1', 
    '방장', 
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    '방문해주셔서 감사합니다 민우님! 좋은 하루 되세요 ☕', 
    NOW() - INTERVAL '3 hours'
  ),
  (
    'reply-seed-3-1', 
    'entry-seed-3', 
    '코더B', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 
    '맞아요, 깔끔하고 UX가 인상적입니다!', 
    NOW() - INTERVAL '30 hours'
  )
ON CONFLICT (id) DO NOTHING;
