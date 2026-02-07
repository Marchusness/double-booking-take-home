import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    venue TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS seats (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    row TEXT NOT NULL,
    number INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('available', 'held', 'booked')),
    heldUntil TEXT,
    userId TEXT,
    price REAL NOT NULL,
    FOREIGN KEY(eventId) REFERENCES events(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    seatId TEXT NOT NULL,
    userId TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(seatId) REFERENCES seats(id)
  );
`);

// Seed data if empty
const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
if (eventCount.count === 0) {
  const eventId = 'event-1';
  db.prepare('INSERT INTO events (id, name, description, date, venue) VALUES (?, ?, ?, ?, ?)')
    .run(eventId, 'The Great Concert', 'An amazing musical experience.', new Date().toISOString(), 'Grand Arena');

  const insertSeat = db.prepare('INSERT INTO seats (id, eventId, row, number, status, price) VALUES (?, ?, ?, ?, ?, ?)');
  const insertManySeats = db.transaction((rows: any[]) => {
    for (const row of rows) insertSeat.run(row.id, row.eventId, row.row, row.number, row.status, row.price);
  });

  const initialSeats = Array.from({ length: 50 }, (_, i) => ({
    id: `seat-${i + 1}`,
    eventId,
    row: String.fromCharCode(65 + Math.floor(i / 10)),
    number: (i % 10) + 1,
    status: 'available',
    price: 100,
  }));

  insertManySeats(initialSeats);
}

export default db;
