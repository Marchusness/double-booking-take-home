import { Router, Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { EventDetailsResponse, GetEventDetailsParamsSchema } from '@double-booking-take-home/common';

export const eventDetailsRouter = Router();

eventDetailsRouter.get('/:eventId', async (req: Request, res: Response) => {
  const params = GetEventDetailsParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ success: false, error: 'Invalid event ID' });
  }

  const details = await EventService.getEventDetails(params.data.eventId);
  if (!details) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  const response: EventDetailsResponse = {
    success: true,
    data: details,
  };
  res.json(response);
});
