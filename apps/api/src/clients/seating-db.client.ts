import { Seat, SeatStatus } from '@double-booking-take-home/common';
import db from '../utils/db';

export const SeatingDbClient = {
  async getSeatingPlan(eventId: string): Promise<Seat[]> {
    const rows = db.prepare('SELECT * FROM seats WHERE eventId = ?').all(eventId) as any[];
    return rows.map(row => ({
      ...row,
      status: row.status as SeatStatus,
      heldUntil: row.heldUntil || undefined,
      userId: row.userId || undefined,
    }));
  },

  async attemptToHoldSeat(seatId: string, checkoutSessionId: string): Promise<Seat | null> {
    const now = new Date().toISOString();
    const heldUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minute hold
    
    // Single query that checks conditions and updates in one go
    // Note: userId is not in the seats table per setup.sql, 
    // it uses checkoutSessionId to track the hold.
    const result = db.prepare(`
      UPDATE seats 
      SET status = 'held', 
          checkoutSessionId = ?, 
          heldUntil = ? 
      WHERE id = ? 
        AND status != 'booked'
        AND (status = 'available' OR heldUntil IS NULL OR heldUntil <= ?)
      RETURNING *
    `).get(checkoutSessionId, heldUntil, seatId, now) as any;

    if (!result) {
      return null;
    }

    return {
      ...result,
      status: result.status as SeatStatus,
      heldUntil: result.heldUntil || undefined,
      checkoutSessionId: result.checkoutSessionId || undefined,
      bookingId: result.bookingId || undefined,
    };
  }
};
