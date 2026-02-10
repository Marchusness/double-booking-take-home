import { EventDbClient } from '../clients/event-db.client';
import { Event, FrontendSeat, Seat } from '@double-booking-take-home/common';
import { toFrontendSeat } from '../utils/frontEndSeat';

export const EventService = {
  async listEvents(): Promise<Event[]> {
    return EventDbClient.getAllEvents();
  },

  async getEventDetails(eventId: string): Promise<{ event: Event } | null> {
    const event = await EventDbClient.getEventById(eventId);
    if (!event) return null;
    
    return { event };
  }
};
