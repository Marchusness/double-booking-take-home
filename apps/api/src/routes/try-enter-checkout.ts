import { Router, Request, Response } from 'express';
import { TryEnterCheckoutResponse, TryEnterCheckoutSchema } from '@double-booking-take-home/common';
import { CheckoutProtectorService } from '../services/checkoutProtector.service';

export const tryEnterCheckoutRouter = Router();

tryEnterCheckoutRouter.post('/', async (req: Request, res: Response) => {
  const body = TryEnterCheckoutSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }
  const { checkoutId } = body.data;
  const userId = (req as any).userId;

  const result = await CheckoutProtectorService.tryEnterCheckout(userId, checkoutId);

  const response: TryEnterCheckoutResponse = {
    success: true,
    data: {
      canProceed: result.canProceed,
      checkoutId: result.checkoutId,
      checkoutExpiresAt: result.checkoutSession?.expiresAt,
    },
  };
  res.json(response);
});
