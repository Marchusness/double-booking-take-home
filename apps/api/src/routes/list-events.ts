import { Router, Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { ListEventsResponse } from '@double-booking-take-home/common';

export const listEventsRouter = Router();

listEventsRouter.get('/', async (req: Request, res: Response) => {
  const events = await EventService.listEvents();
  const response: ListEventsResponse = {
    success: true,
    data: events,
  };
  res.json(response);
});
