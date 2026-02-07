import { Seat } from '@double-booking-take-home/common';

export type Hold = {
  userId: string;
  expiresAt: number;
};

export type BookingState = {
  seats: Seat[];
  holds: Map<string, Hold>;
};
