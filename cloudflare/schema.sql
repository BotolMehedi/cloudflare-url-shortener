CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  alias TEXT,
  clicks INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER,
  expires_at INTEGER,
  client_id TEXT
);

CREATE TABLE IF NOT EXISTS click_analytics (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  clicked_at INTEGER,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);


-- Admin Panel Tables

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'admin',
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  expires_at INTEGER,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  link_id TEXT,
  reporter_name TEXT,
  reporter_email TEXT,
  link_url TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS blocked_domains (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE,
  reason TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at INTEGER
);

INSERT INTO users (id, username, password_hash, role, created_at)
VALUES (
  lower(hex(randomblob(16))), 
  'admin', 
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
  'admin', 
  strftime('%s', 'now') * 1000
);

CREATE INDEX IF NOT EXISTS idx_click_analytics_link_id ON click_analytics(link_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_client_id ON links(client_id);
