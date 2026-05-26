import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'game.db');
const schemaPath = join(__dirname, 'schema.sql');

export function createDb() {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const schema = readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('✅ Banco de dados inicializado em', dbPath);
  return db;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createDb();
  console.log('✅ Setup concluído. Rode: npm run dev --workspace=server');
}
