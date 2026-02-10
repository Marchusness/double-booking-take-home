// Simulating a NoSQL Database for checkout sessions
// key: CheckoutId

export interface CheckoutSession {
  checkoutId: string;
  userId: string;
  expiresAt: number;
}

const EXPIRY_TIME_MS = 10 * 60 * 1000; // 10 minutes

// in a real production system this would be a real database
const sessions = new Map<string, CheckoutSession>();

export const CheckoutDbClient = {
  async createCheckoutSession(userId: string, checkoutId: string): Promise<CheckoutSession> {
    const session = sessions.get(checkoutId);
    if (session) {
      return session;
    }
    const expiresAt = Date.now() + EXPIRY_TIME_MS;
    const newSession = { checkoutId, userId, expiresAt };
    sessions.set(checkoutId, newSession);
    return newSession;
  },

  async isAllowedInCheckout(checkoutId: string): Promise<boolean> {
    const session = await this.getCheckoutSession(checkoutId);
    if (!session) return false;
    if (session.expiresAt < Date.now()) return false;
    return !!session;
  },

  async getCheckoutSession(checkoutId?: string): Promise<CheckoutSession | null> {
    if (!checkoutId) return null;
    const session = sessions.get(checkoutId);
    if (!session) return null;
    return session;
  },
};
