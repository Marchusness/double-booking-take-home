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
  heldUntil: z.string().optional(),
  userId: z.string().optional(),
  price: z.number(),
});
export type Seat = z.infer<typeof SeatSchema>;

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  date: z.string(),
  venue: z.string(),
});
export type Event = z.infer<typeof EventSchema>;

// --- Request Schemas ---

export const GetEventDetailsParamsSchema = z.object({
  eventId: z.string(),
});

export const TryEnterCheckoutSchema = z.object({
  eventId: z.string(),
  seatId: z.string(),
});

export const AttemptClaimSeatSchema = z.object({
  eventId: z.string(),
  seatId: z.string(),
});

export const CheckoutSchema = z.object({
  eventId: z.string(),
  seatId: z.string(),
});

// --- Response Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ListEventsResponse = ApiResponse<Event[]>;
export type EventDetailsResponse = ApiResponse<{
  event: Event;
  seatingPlan: Seat[];
}>;
export type TryEnterCheckoutResponse = ApiResponse<{
  canProceed: boolean;
  message?: string;
}>;
export type AttemptClaimSeatResponse = ApiResponse<{
  seat: Seat;
}>;
export type CheckoutResponse = ApiResponse<{
  bookingId: string;
  seat: Seat;
}>;
