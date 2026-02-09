import { Router, Request, Response } from 'express';
import { CheckoutResponse, CheckoutSchema } from '@double-booking-take-home/common';
import { CheckoutService } from '../services/checkout.service';

export const checkoutRouter = Router();

checkoutRouter.post('/', async (req: Request, res: Response) => {
  const body = CheckoutSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const userId = (req as any).userId;
  const { seatIds, checkoutId } = body.data;

  const result = await CheckoutService.finaliseCheckout(checkoutId, seatIds, userId);

  if (!result) {
    return res.status(409).json({ success: false, error: 'Checkout failed. Session may have expired or is invalid.' });
  }

  const response: CheckoutResponse = {
    success: true,
    data: {
      bookingId: result.id,
    },
  };
  res.json(response);
});
