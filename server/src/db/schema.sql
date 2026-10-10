-- FIELDNOTE SQLite Schema
-- Dedicated to offline-first local persistence of natural observation investigations

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  sequence_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  grounding_constraint TEXT NOT NULL,
  inquiry_question TEXT NOT NULL,
  sensory_focus TEXT NOT NULL, -- JSON array of SensoryFocus: ["visual", "temporal"]
  target_duration_seconds INTEGER NOT NULL DEFAULT 30,
  field_mode_notice TEXT NOT NULL DEFAULT 'LOOK. NOTICE. REMEMBER. Put your phone away.',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'in_field' | 'observed' | 'reflected' | 'completed' | 'archived'
  environment_context TEXT, -- JSON: { timeOfDay, weatherHint, habitatHint, season }
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  actual_duration_seconds INTEGER NOT NULL DEFAULT 0,
  raw_notes TEXT NOT NULL,
  sensory_details TEXT, -- JSON: { visual, auditory, tactile, temporal }
  photo_uri TEXT,
  audio_uri TEXT,
  put_away_complied INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  observation_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  synthetic_insight TEXT NOT NULL,
  deepening_question TEXT NOT NULL,
  curiosity_tags TEXT NOT NULL, -- JSON array: ["erosion", "lichen", "rain-shadow"]
  next_investigation_seed TEXT,
  model_name TEXT NOT NULL,
  inference_duration_ms INTEGER NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'ollama',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS discoveries (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  reflection_id TEXT NOT NULL,
  title TEXT NOT NULL,
  field_category TEXT NOT NULL,
  significance_score INTEGER NOT NULL DEFAULT 1,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE,
  FOREIGN KEY (reflection_id) REFERENCES reflections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS field_sessions (
  id TEXT PRIMARY KEY,
  active_investigation_id TEXT,
  current_phase TEXT NOT NULL DEFAULT 'prepare', -- 'prepare' | 'observe' | 'return' | 'reflect' | 'discover'
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  field_entered_at TEXT,
  returned_at TEXT,
  phone_away_seconds INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (active_investigation_id) REFERENCES investigations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Indices for rapid journal timeline queries
CREATE INDEX IF NOT EXISTS idx_investigations_sequence ON investigations(sequence_number);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_observations_investigation ON observations(investigation_id);
CREATE INDEX IF NOT EXISTS idx_reflections_investigation ON reflections(investigation_id);
CREATE INDEX IF NOT EXISTS idx_field_sessions_phase ON field_sessions(current_phase);
