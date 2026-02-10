import { z } from 'zod';

// --- Base Types ---
export const SeatStatusSchema = z.enum(['available', 'held', 'booked']);
export type SeatStatus = z.infer<typeof SeatStatusSchema>;

export const SeatSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  row: z.string(),
  number: z.number(),
  status: SeatStatusSchema,
  heldUntil: z.number().optional(),
  checkoutSessionId: z.string().optional(),
  bookingId: z.number().optional(),
  price: z.number(),
});
export type Seat = z.infer<typeof SeatSchema>;

export const BookingSchema = z.object({
  id: z.number(),
  checkoutSessionId: z.string(),
  userId: z.string(),
  createdAt: z.number(),
});
export type Booking = z.infer<typeof BookingSchema>;

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  date: z.string(),
  venue: z.string(),
});
export type Event = z.infer<typeof EventSchema>;

// --- Frontend Types ---

export const FrontendSeatStatusSchema = z.enum(['available', 'heldByCurrentCheckoutSession', 'notAvailable']);
export type FrontendSeatStatus = z.infer<typeof FrontendSeatStatusSchema>;

export const FrontendSeatSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  row: z.string(),
  number: z.number(),
  status: FrontendSeatStatusSchema,
  price: z.number(),
  lastUpdatedAt: z.number(),
});
export type FrontendSeat = z.infer<typeof FrontendSeatSchema>;

// --- Request Schemas ---

export const GetEventDetailsParamsSchema = z.object({
  eventId: z.string(),
});

export const TryEnterCheckoutSchema = z.object({
  eventId: z.string(),
  checkoutId: z.string().optional(),
});

export const AttemptClaimSeatSchema = z.object({
  eventId: z.string(),
  seatId: z.string(),
  checkoutId: z.string(),
});

export const CheckoutSchema = z.object({
  eventId: z.string(),
  seatIds: z.array(z.string()),
  checkoutId: z.string(),
});

// --- Response Types ---

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
}

export type ListEventsResponse = ApiResponse<Event[]>;
export type EventDetailsResponse = ApiResponse<{
  event: Event;
}>;

export type GetSeatingPlanResponse = ApiResponse<{
  seatingPlan: FrontendSeat[];
}>;

export type UnclaimSeatResponse = ApiResponse<{
  seat: FrontendSeat;
}>;
export type TryEnterCheckoutResponse = ApiResponse<{
  canProceed: boolean;
  checkoutId: string;
  checkoutExpiresAt?: number;
}>;
export type AttemptClaimSeatResponse = ApiResponse<{
  seat: FrontendSeat;
}>;
export type CheckoutResponse = ApiResponse<{
  bookingId: string;
}>;
