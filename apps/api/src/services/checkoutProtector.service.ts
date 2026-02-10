import { CheckoutDbClient, CheckoutSession } from '../clients/checkout-session-db.client';
import { CheckoutQueueClient } from '../clients/checkout-queue.client';
import { randomUUID } from 'crypto';
import { CHECKOUT_QUEUE_RATE_LIMIT } from '../worker/checkoutQueueConsumer';

export const CheckoutProtectorService = {
  async tryEnterCheckout(
    userId: string, 
    checkoutId?: string
  ): Promise<{ canProceed: boolean; checkoutId: string; message?: string, checkoutSession?: CheckoutSession }> {
    if (!checkoutId) {
      checkoutId = randomUUID();

      if ((await CheckoutQueueClient.checkoutQueueLength()) < CHECKOUT_QUEUE_RATE_LIMIT) {
        const session = await CheckoutDbClient.createCheckoutSession(userId, checkoutId);
        await CheckoutQueueClient.enqueueCheckout({ userId, checkoutId, inCheckout: true });
        return { canProceed: true, checkoutId: checkoutId, checkoutSession: session };
      } else {
        await CheckoutQueueClient.enqueueCheckout({ userId, checkoutId, inCheckout: false });
        return { canProceed: false, checkoutId: checkoutId, message: 'Checkout is currently busy. Please try again in a second.' };
      }
    }

    return await this.getCheckoutSession(checkoutId);
  },

  async getCheckoutSession(checkoutId: string): Promise<{
    canProceed: boolean;
    checkoutId: string;
    checkoutSession?: CheckoutSession;
    message?: string;
  }> {
    const session = await CheckoutDbClient.getCheckoutSession(checkoutId);
    if (!session) return { canProceed: false, checkoutId: checkoutId, message: 'Checkout session not found.' };
    if (session.expiresAt < Date.now()) return { canProceed: false, checkoutId: checkoutId, message: 'Checkout session expired.', checkoutSession: session };
    return { canProceed: true, checkoutId: session.checkoutId, checkoutSession: session };
  }
};
