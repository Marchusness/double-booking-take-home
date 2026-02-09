import { CheckoutDbClient } from "../clients/checkout-session-db.client";
import { CheckoutQueueClient } from "../clients/checkout-queue.client";

export const CHECKOUT_QUEUE_RATE_LIMIT = 5; // 5 requests per second
const WINDOW_MS = 1000; // 1 second window

// in a production system this would be a queue consumer
export const CheckoutQueueConsumer = {
    async consumeCheckoutQueue(): Promise<void> {
        setInterval(async () => {
            for (let i = 0; i < CHECKOUT_QUEUE_RATE_LIMIT; i++) {
                const item = await CheckoutQueueClient.dequeueCheckout();
                if (!item) break;
                await CheckoutDbClient.createCheckoutSession(item.userId, item.checkoutId);
            }
        }, WINDOW_MS);
    }
}