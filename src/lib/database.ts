import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'kido.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
export function initializeDatabase() {
  // Children table
  db.exec(`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Measurements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS measurements (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      measurement_date TEXT NOT NULL,
      age_in_days INTEGER NOT NULL,
      weight REAL,
      height REAL,
      head_circumference REAL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec('CREATE INDEX IF NOT EXISTS idx_measurements_child_id ON measurements (child_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements (measurement_date)');
}

// Child operations
export const childQueries = {
  getAll: db.prepare('SELECT * FROM children ORDER BY created_at DESC'),
  getById: db.prepare('SELECT * FROM children WHERE id = ?'),
  create: db.prepare(`
    INSERT INTO children (id, name, date_of_birth, sex, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE children 
    SET name = ?, date_of_birth = ?, sex = ?, notes = ?
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM children WHERE id = ?'),
};

// Measurement operations
export const measurementQueries = {
  getAll: db.prepare(`
    SELECT m.*, c.name as child_name, c.date_of_birth, c.sex
    FROM measurements m
    JOIN children c ON m.child_id = c.id
    ORDER BY m.measurement_date DESC
  `),
  getByChildId: db.prepare(`
    SELECT m.*, c.name as child_name, c.date_of_birth, c.sex
    FROM measurements m
    JOIN children c ON m.child_id = c.id
    WHERE m.child_id = ?
    ORDER BY m.measurement_date DESC
  `),
  getById: db.prepare(`
    SELECT m.*, c.name as child_name, c.date_of_birth, c.sex
    FROM measurements m
    JOIN children c ON m.child_id = c.id
    WHERE m.id = ?
  `),
  create: db.prepare(`
    INSERT INTO measurements (id, child_id, measurement_date, age_in_days, weight, height, head_circumference, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE measurements 
    SET measurement_date = ?, age_in_days = ?, weight = ?, head_circumference = ?, notes = ?
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM measurements WHERE id = ?'),
};

// Initialize database on import
initializeDatabase();

export default db;