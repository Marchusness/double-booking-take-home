import { Seat } from '@double-booking-take-home/common';
import { SeatingDbClient } from '../clients/seating-db.client';
import { CheckoutSession } from '../clients/checkout-session-db.client';
import { CheckoutProtectorService } from './checkoutProtector.service';

export const SeatingService = {
  async getSeats(eventId: string): Promise<Seat[]> {
    return SeatingDbClient.getSeatingPlan(eventId);
  },

  async attemptHoldSeat(seatId: string, checkoutId: string, userId: string): Promise<Seat | null> {
    const { canProceed, checkoutSession } = await CheckoutProtectorService.getCheckoutSession(checkoutId);

    if (!canProceed || !checkoutSession || checkoutSession.userId !== userId) {
      return null;
    }

    return SeatingDbClient.attemptToHoldSeat(
      seatId,
      checkoutSession.checkoutId
    );
  },
};
