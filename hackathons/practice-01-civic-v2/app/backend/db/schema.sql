-- ProofClose SQLite schema. Statuses: OPEN | REOPENED | VERIFIED.
DROP TABLE IF EXISTS verifications;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS ai_cache;

CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('pothole','garbage','streetlight','water_leak','other')),
  department TEXT NOT NULL,
  ward_no INTEGER,
  ward_name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','REOPENED','VERIFIED')),
  summary TEXT NOT NULL,
  before_photo BLOB,
  after_photo BLOB,
  escalation_draft TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
-- officer queue: WHERE ward_no=? AND status IN (...)
CREATE INDEX idx_tickets_ward_status ON tickets(ward_no, status);

CREATE TABLE reports (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  note TEXT,
  photo BLOB,
  ai_source TEXT NOT NULL CHECK (ai_source IN ('gemini','cache','manual','seed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_reports_ticket ON reports(ticket_id);

CREATE TABLE verifications (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL CHECK (verdict IN ('fixed','not_fixed','unclear')),
  confidence REAL NOT NULL,
  reason TEXT NOT NULL,
  ai_source TEXT NOT NULL CHECK (ai_source IN ('gemini','cache','manual','seed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_verifications_ticket ON verifications(ticket_id);

CREATE TABLE ai_cache (
  key TEXT PRIMARY KEY,          -- sha256(kind + image bytes)
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
