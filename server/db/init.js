import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'game.db');
const schemaPath = join(__dirname, 'schema.sql');

export function createDb() {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const schema = readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  runMigrations(db);
  console.log('Banco de dados inicializado em', dbPath);
  return db;
}

function runMigrations(db) {
  ensureColumn(db, 'players', 'current_session_id', 'TEXT');
  ensureColumn(db, 'response_logs', 'session_id', 'TEXT');
  backfillLegacySession(db);

  db.prepare(`
    UPDATE response_logs
    SET session_id = (
      SELECT current_session_id
      FROM players
      WHERE players.id = response_logs.player_id
    )
    WHERE session_id IS NULL
  `).run();
}

function ensureColumn(db, tableName, columnName, sqlType) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${sqlType}`).run();
}

function backfillLegacySession(db) {
  const playersWithoutSession = db.prepare(`
    SELECT COUNT(*) as total
    FROM players
    WHERE current_session_id IS NULL
  `).get();

  if (!playersWithoutSession?.total) {
    return;
  }

  const firstPlayer = db.prepare(`
    SELECT created_at
    FROM players
    WHERE current_session_id IS NULL
    ORDER BY created_at ASC
    LIMIT 1
  `).get();

  const legacySessionId = randomUUID();
  db.prepare(`
    INSERT INTO game_sessions (id, started_at, ended_at)
    VALUES (?, COALESCE(?, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP)
  `).run(legacySessionId, firstPlayer?.created_at || null);

  db.prepare(`
    UPDATE players
    SET current_session_id = ?
    WHERE current_session_id IS NULL
  `).run(legacySessionId);
}

export function startGameSession(db) {
  db.prepare(`
    UPDATE game_sessions
    SET ended_at = COALESCE(ended_at, CURRENT_TIMESTAMP)
    WHERE ended_at IS NULL
  `).run();

  const sessionId = randomUUID();
  db.prepare('INSERT INTO game_sessions (id) VALUES (?)').run(sessionId);
  return sessionId;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createDb();
  console.log('Setup concluido. Rode: npm run dev --workspace=server');
}
