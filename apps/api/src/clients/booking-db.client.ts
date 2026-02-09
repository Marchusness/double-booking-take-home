import db from "../utils/db";

export interface Booking {
  id: string;
  checkoutSessionId: string;
  userId: string;
  createdAt: string;
}

// a single sql command would be better in production as the db would be running in a different process to the api 
// so the api and db can scale independently. but i'm going to keep it simple for a take home.
const singleSqlCommand = `
WITH validated_seats AS (
    -- 1. Lock and validate all seats in one go
    SELECT id 
    FROM seats 
    WHERE id ANY($1) -- $1 is the array of seatIds
      AND (
        status = 'available' 
        OR (status = 'held' AND checkoutSessionId = $2 AND heldUntil >= NOW())
      )
    FOR UPDATE -- This locks the rows so no other Lambda can touch them
),
inserted_booking AS (
    -- 2. Only insert the booking if the number of validated seats matches
    INSERT INTO bookings (checkoutSessionId, userId)
    SELECT $2, $3
    WHERE (SELECT COUNT(*) FROM validated_seats) = array_length($1, 1)
    RETURNING id
),
updated_seats AS (
    -- 3. Update the seats only if the booking was successfully created
    UPDATE seats
    SET status = 'booked', 
        bookingId = (SELECT id FROM inserted_booking),
        heldUntil = NULL,
        checkoutSessionId = NULL
    WHERE id IN (SELECT id FROM validated_seats)
      AND EXISTS (SELECT 1 FROM inserted_booking)
    RETURNING id
)
SELECT * FROM inserted_booking;
`;

export const BookingDbClient = {
  async createBooking(checkoutSessionId: string, seatIds: string[], userId: string): Promise<Booking | null> {
    const now = new Date().toISOString();
    
    const transaction = db.transaction(() => {
      // 1. Check if all seats are either available or held by this checkoutSessionId
      // We also check heldUntil to ensure the hold hasn't expired
      const placeholders = seatIds.map(() => '?').join(',');
      const seats = db.prepare(`
        SELECT id, status, checkoutSessionId, heldUntil 
        FROM seats 
        WHERE id IN (${placeholders})
      `).all(...seatIds) as any[];

      if (seats.length !== seatIds.length) {
        return null; // Some seats don't exist
      }

      for (const seat of seats) {
        const isAvailable = seat.status === 'available';
        const isHeldByMe = seat.status === 'held' && 
                          seat.checkoutSessionId === checkoutSessionId && 
                          (!seat.heldUntil || seat.heldUntil >= now);
        
        if (!isAvailable && !isHeldByMe) {
            // TODO: Pass error message up to the api so it can be returned to the user.
          return null; // Seat is already booked or held by someone else
        }
      }

      // 2. Create the booking
      // Note: id is INTEGER PRIMARY KEY AUTOINCREMENT in setup.sql, but we can also use UUID if we want consistency.
      // However, the user's setup.sql has id INTEGER PRIMARY KEY AUTOINCREMENT.
      // Let's use the DB's auto-generation.
      const bookingResult = db.prepare(
        'INSERT INTO bookings (checkoutSessionId, userId) VALUES (?, ?)'
      ).run(checkoutSessionId, userId);

      const bookingId = bookingResult.lastInsertRowid.toString();

      // 3. Convert all seats to booked and link to the booking
      const updateSeat = db.prepare(`
        UPDATE seats 
        SET status = 'booked', 
            bookingId = ?, 
            heldUntil = NULL, 
            checkoutSessionId = NULL,
            userId = ?
        WHERE id = ?
      `);

      for (const seatId of seatIds) {
        updateSeat.run(bookingId, userId, seatId);
      }

      return db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) as Booking;
    });

    return transaction();
  },
};