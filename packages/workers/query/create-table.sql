-- 이미 생성된 인덱스가 있다면 삭제
DROP INDEX IF EXISTS idx_shared_layout_id;

-- 이미 생성된 테이블이 있다면 삭제
DROP TABLE IF EXISTS shared_layout;

-- 테이블 생성
CREATE TABLE IF NOT EXISTS shared_layout (
  id TEXT PRIMARY KEY,
  layout TEXT NOT NULL,
  view INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS idx_shared_layout_id ON shared_layout(id);