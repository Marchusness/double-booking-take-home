import { Event, Seat, SeatStatus } from '@double-booking-take-home/common';
import db from '../utils/db';

export const EventDbClient = {
  async getAllEvents(): Promise<Event[]> {
    return db.prepare('SELECT * FROM events').all() as Event[];
  },

  async getEventById(eventId: string): Promise<Event | null> {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId) as Event | undefined;
    return event || null;
  },

  async getSeatingPlan(eventId: string): Promise<Seat[]> {
    const rows = db.prepare('SELECT * FROM seats WHERE eventId = ?').all(eventId) as any[];
    return rows.map(row => ({
      ...row,
      status: row.status as SeatStatus,
      heldUntil: row.heldUntil || undefined,
      userId: row.userId || undefined,
    }));
  }
};
