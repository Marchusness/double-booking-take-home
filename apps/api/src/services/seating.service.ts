import { SeatingDbClient } from '../clients/seating-db.client';
import { CheckoutProtectorService } from './checkoutProtector.service';
import { toFrontendSeat } from '../utils/frontEndSeat';
import { FrontendSeat, Seat } from '@double-booking-take-home/common';

export const SeatingService = {
  async getSeats(eventId: string, checkoutId?: string): Promise<FrontendSeat[]> {
    const seats = await SeatingDbClient.getSeatingPlan(eventId);
    return seats.map(seat => toFrontendSeat(seat, checkoutId || null));
  },

  async attemptHoldSeat(seatId: string, checkoutId: string, userId: string): Promise<FrontendSeat | null> {
    const { canProceed, checkoutSession } = await CheckoutProtectorService.getCheckoutSession(checkoutId);

    if (!canProceed || !checkoutSession || checkoutSession.userId !== userId) {
      console.error(`[SeatingService] Attempt to hold seat failed. Can proceed: ${canProceed}, Checkout session: ${JSON.stringify(checkoutSession)}, User ID: ${userId}`);
      return null;
    }

    const result = await SeatingDbClient.attemptToHoldSeat(
      seatId,
      checkoutSession.checkoutId
    );
    if (!result) {
      return null;
    }

    return toFrontendSeat(result, checkoutId);
  },

  async unholdSeat(seatId: string, checkoutId: string, userId: string): Promise<FrontendSeat | null> {
    const { canProceed, checkoutSession } = await CheckoutProtectorService.getCheckoutSession(checkoutId);

    if (!canProceed || !checkoutSession || checkoutSession.userId !== userId) {
      return null;
    }

    const result = await SeatingDbClient.unholdSeat(seatId, checkoutSession.checkoutId);
    if (!result) {
      return null;
    }

    return toFrontendSeat(result, checkoutId);
  },
};
