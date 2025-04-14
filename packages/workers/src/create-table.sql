-- 이미 생성된 테이블이 있다면 삭제
DROP TABLE IF EXISTS shared_layout;

-- 테이블 생성
CREATE TABLE IF NOT EXISTS shared_layout (
  id TEXT PRIMARY KEY,
  layout TEXT NOT NULL,
  view INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);