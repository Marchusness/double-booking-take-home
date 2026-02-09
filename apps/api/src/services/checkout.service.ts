import { CheckoutDbClient } from "../clients/checkout-session-db.client";
import { BookingDbClient, Booking } from "../clients/booking-db.client";
import { CheckoutProtectorService } from "./checkoutProtector.service";

export const CheckoutService = {
  async finaliseCheckout(checkoutId: string, seatIds: string[], userId: string): Promise<Booking | null> {
    // 1. Get and validate the checkout session via Protector Service
    const { canProceed, checkoutSession } = await CheckoutProtectorService.getCheckoutSession(checkoutId);
    
    if (!canProceed || !checkoutSession) {
      console.error(`[CheckoutService] Session invalid or not found for checkoutId: ${checkoutId}`);
      return null;
    }

    if (checkoutSession.userId !== userId) {
      console.error(`[CheckoutService] User mismatch. Session user: ${checkoutSession.userId}, Request user: ${userId}`);
      return null;
    }

    // 2. Call BookingDbClient to create the booking and update seats atomically
    const booking = await BookingDbClient.createBooking(checkoutId, seatIds, userId);

    if (booking) {
      // 3. Cleanup the checkout session after a successful booking
      await CheckoutDbClient.deleteCheckoutSession(checkoutId);
    }

    return booking;
  },
};