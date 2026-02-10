import { Router, Request, Response } from 'express';
import { SeatingService } from '../services/seating.service';
import { GetSeatingPlanResponse } from '@double-booking-take-home/common';

export const seatingPlanRouter = Router();

seatingPlanRouter.get('/:eventId', async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const checkoutId = req.query.checkoutId as string | undefined;

  const seatingPlan = await SeatingService.getSeats(eventId, checkoutId);

  const response: GetSeatingPlanResponse = {
    success: true,
    data: { seatingPlan },
  };
  res.json(response);
});
