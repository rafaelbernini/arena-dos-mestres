-- Arena dos Mestres da Lógica — Schema SQLite
-- SESI · 7° Ano · 11-12 anos

CREATE TABLE IF NOT EXISTS rooms (
  id               INTEGER PRIMARY KEY,
  room_key         TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  theme            TEXT NOT NULL,
  emoji            TEXT NOT NULL,
  required_room_id INTEGER,
  score_multiplier REAL DEFAULT 1.0,
  unlock_bonus     INTEGER DEFAULT 0,
  boss_name        TEXT,
  FOREIGN KEY (required_room_id) REFERENCES rooms(id)
);

INSERT OR IGNORE INTO rooms VALUES
  (1,'floresta','Floresta dos Números','multiplos','🌳',NULL,1.0,0,'Árvore Anciã'),
  (2,'caverna','Caverna de Cristais','fracoes','💎',1,1.3,300,'Hidra das Frações'),
  (3,'porto','Porto dos Mercadores','decimais','⚓',2,1.6,500,'Capitão Décimo'),
  (4,'castelo','Castelo dos Segredos','inteiros','🏰',3,2.0,800,'Guardião do Castelo');

CREATE TABLE IF NOT EXISTS players (
  id               TEXT PRIMARY KEY,
  nickname         TEXT NOT NULL UNIQUE,
  hero_class       TEXT NOT NULL,
  avatar_json      TEXT NOT NULL DEFAULT '{}',
  current_session_id TEXT,
  current_room_id  INTEGER DEFAULT 1,
  current_phase    INTEGER DEFAULT 1,
  total_score      INTEGER DEFAULT 0,
  rooms_completed  INTEGER DEFAULT 0,
  connected        INTEGER DEFAULT 1,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (current_room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS player_room_progress (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id     TEXT NOT NULL,
  room_id       INTEGER NOT NULL,
  phases_done   TEXT DEFAULT '[]',
  room_score    INTEGER DEFAULT 0,
  boss_defeated INTEGER DEFAULT 0,
  is_completed  INTEGER DEFAULT 0,
  started_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at  TIMESTAMP,
  UNIQUE(player_id, room_id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS response_logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id       TEXT NOT NULL,
  session_id      TEXT,
  room_id         INTEGER NOT NULL,
  phase           INTEGER NOT NULL,
  variation       TEXT,
  answer_given    TEXT NOT NULL,
  is_correct      INTEGER NOT NULL,
  points_earned   INTEGER NOT NULL,
  attempts_used   INTEGER DEFAULT 1,
  response_time_s REAL NOT NULL,
  hint_used       INTEGER DEFAULT 0,
  timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id          TEXT PRIMARY KEY,
  started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at    TIMESTAMP,
  winner_id   TEXT,
  FOREIGN KEY (winner_id) REFERENCES players(id)
);

CREATE INDEX IF NOT EXISTS idx_total_score ON players(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_rooms_done  ON players(rooms_completed DESC);
CREATE INDEX IF NOT EXISTS idx_progress    ON player_room_progress(player_id, room_id);
