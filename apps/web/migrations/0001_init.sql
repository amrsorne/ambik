-- ambik-stats D1 schema (aggregate metrics only, no PII)

CREATE TABLE IF NOT EXISTS metric_events_daily (
  day TEXT NOT NULL,
  metric TEXT NOT NULL,
  dim1 TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric, dim1)
);

CREATE TABLE IF NOT EXISTS public_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  as_of TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_metric_events_day_metric
  ON metric_events_daily (day, metric);
