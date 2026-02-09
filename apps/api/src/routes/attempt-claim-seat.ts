import { Router, Request, Response } from 'express';
import { SeatingService } from '../services/seating.service';
import { AttemptClaimSeatResponse, AttemptClaimSeatSchema } from '@double-booking-take-home/common';

export const attemptClaimSeatRouter = Router();

attemptClaimSeatRouter.post('/', async (req: Request, res: Response) => {
  const body = AttemptClaimSeatSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }
  
  const { seatId, checkoutId } = body.data;
  const userId = (req as any).userId;

  const seat = await SeatingService.attemptHoldSeat(seatId, checkoutId, userId);

  if (!seat) {
    return res.status(409).json({ success: false, error: 'Seat is no longer available or session is invalid' });
  }

  const response: AttemptClaimSeatResponse = {
    success: true,
    data: { seat },
  };
  res.json(response);
});
