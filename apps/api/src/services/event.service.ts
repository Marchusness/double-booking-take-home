import { EventDbClient } from '../clients/event-db.client';
import { Event, Seat } from '@double-booking-take-home/common';

export const EventService = {
  async listEvents(): Promise<Event[]> {
    return EventDbClient.getAllEvents();
  },

  async getEventDetails(eventId: string): Promise<{ event: Event; seatingPlan: Seat[] } | null> {
    const event = await EventDbClient.getEventById(eventId);
    if (!event) return null;
    
    const seatingPlan = await EventDbClient.getSeatingPlan(eventId);
    return { event, seatingPlan };
  }
};
