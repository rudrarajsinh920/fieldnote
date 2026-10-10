import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure directory exists for sqlite file
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new DatabaseSync(config.dbPath);
  
  // Enable WAL mode and foreign keys for robustness
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');

const DEFAULT_SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  sequence_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  grounding_constraint TEXT NOT NULL,
  inquiry_question TEXT NOT NULL,
  sensory_focus TEXT NOT NULL,
  target_duration_seconds INTEGER NOT NULL DEFAULT 30,
  field_mode_notice TEXT NOT NULL DEFAULT 'LOOK. NOTICE. REMEMBER. Put your phone away.',
  status TEXT NOT NULL DEFAULT 'pending',
  environment_context TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  actual_duration_seconds INTEGER NOT NULL DEFAULT 0,
  raw_notes TEXT NOT NULL,
  sensory_details TEXT,
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
  curiosity_tags TEXT NOT NULL,
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
  current_phase TEXT NOT NULL DEFAULT 'prepare',
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

CREATE INDEX IF NOT EXISTS idx_investigations_sequence ON investigations(sequence_number);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_observations_investigation ON observations(investigation_id);
CREATE INDEX IF NOT EXISTS idx_reflections_investigation ON reflections(investigation_id);
CREATE INDEX IF NOT EXISTS idx_field_sessions_phase ON field_sessions(current_phase);
`;

  // Run schema initialization: check disk paths, fallback to embedded schema
  const candidatePaths = [
    path.resolve(__dirname, 'schema.sql'),
    path.resolve(__dirname, '../../src/db/schema.sql'),
    path.resolve(process.cwd(), 'server/src/db/schema.sql'),
    path.resolve(process.cwd(), 'src/db/schema.sql'),
  ];
  let schemaLoaded = false;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const schemaSql = fs.readFileSync(p, 'utf-8');
        dbInstance.exec(schemaSql);
        schemaLoaded = true;
        break;
      } catch {
        // continue
      }
    }
  }
  if (!schemaLoaded) {
    dbInstance.exec(DEFAULT_SCHEMA_SQL);
  }

  // Safe migrations for existing SQLite databases
  try {
    const obsCols = (dbInstance.prepare('PRAGMA table_info(observations)').all() as any[]).map((c) => c.name);
    if (!obsCols.includes('audio_uri')) {
      dbInstance.exec('ALTER TABLE observations ADD COLUMN audio_uri TEXT;');
    }
    const refCols = (dbInstance.prepare('PRAGMA table_info(reflections)').all() as any[]).map((c) => c.name);
    if (!refCols.includes('next_investigation_seed')) {
      dbInstance.exec('ALTER TABLE reflections ADD COLUMN next_investigation_seed TEXT;');
    }
  } catch (migErr) {
    console.warn('[DB Migration Notice]', migErr);
  }

  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
