import { Seat, FrontendSeat, FrontendSeatStatus } from '@double-booking-take-home/common';

export function toFrontendSeat(seat: Seat, checkoutId: string | null): FrontendSeat {

  let status: FrontendSeatStatus = 'available';

  if (seat.status === "held" && seat.checkoutSessionId === checkoutId) {
    status = 'heldByCurrentCheckoutSession';
  } else if (seat.status === "held" && seat.heldUntil && seat.heldUntil > Date.now()) {
    status = 'notAvailable';
  } else if (seat.status === 'booked') {
    status = 'notAvailable';
  }

  return {
    id: seat.id,
    eventId: seat.eventId,
    row: seat.row,
    number: seat.number,
    status,
    price: seat.price,
    lastUpdatedAt: Date.now(),
  };
}