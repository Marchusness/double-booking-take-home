CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    venue TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checkoutSessionId TEXT NOT NULL,
    userId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- seats for this booking will be stored in the seats table
);

CREATE TABLE IF NOT EXISTS seats (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    row TEXT NOT NULL,
    number INTEGER NOT NULL,
    price REAL NOT NULL,

    status TEXT NOT NULL CHECK(status IN ('available', 'held', 'booked')),
    -- available no variables required

    -- held
    heldUntil INTEGER,
    checkoutSessionId TEXT,

    -- booked
    bookingId INTEGER,
    
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(bookingId) REFERENCES bookings(id)
);