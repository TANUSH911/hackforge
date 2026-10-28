-- Replace `items` with your app's tables. Keep ai_cache: it makes the demo work offline.
CREATE TABLE items (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  label       TEXT,                 -- filled by AI
  created_at  TEXT NOT NULL
);

-- key = sha256(kind + inputs); response_json = the validated AI output
CREATE TABLE ai_cache (
  key            TEXT PRIMARY KEY,
  response_json  TEXT NOT NULL
);
