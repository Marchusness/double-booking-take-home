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