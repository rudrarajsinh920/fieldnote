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

  // Run schema initialization
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    dbInstance.exec(schemaSql);
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
