// Simulating a rate limit queue. something like Reddis or sqs would be used in a real production system.

// in a real production system this would be a real queue like redis or sqs
let enterCheckoutQueue: {
  userId: string;
  checkoutId: string;
  inCheckout: boolean;
}[] = [];

export const CheckoutQueueClient = {
  async checkoutQueueLength(): Promise<number> {
    return enterCheckoutQueue.length;
  },

  async enqueueCheckout(data: { userId: string, checkoutId: string, inCheckout: boolean }): Promise<void> {
    enterCheckoutQueue.push({ ...data });
  },

  async dequeueCheckout(): Promise<{ userId: string, checkoutId: string } | null> {
    // In a real system, this would pop from a queue for background processing
    const item = enterCheckoutQueue.shift();
    return item ? { userId: item.userId, checkoutId: item.checkoutId } : null;
  }
};
