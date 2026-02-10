'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Seat, TryEnterCheckoutResponse, AttemptClaimSeatResponse, CheckoutResponse, FrontendSeat } from '@double-booking-take-home/common';

export type CheckoutStep = 'queue' | 'seating' | 'payment' | 'completed';

export function useCheckoutSession(eventId: string | null) {
  const router = useRouter();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [checkoutTimeRemaining, setCheckoutTimeRemaining] = useState<number | null>(null);
  const [checkoutExpiresAt, setCheckoutExpiresAt] = useState<number | null>(null);
  const [step, setStep] = useState<CheckoutStep>('queue');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // 1. Poll try-enter-checkout every 5 seconds
  useEffect(() => {
    if (!eventId || step !== 'queue') return;

    const tryEnter = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/try-enter-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, checkoutId: checkoutId || undefined }),
          credentials: 'include',
        });
        const data: TryEnterCheckoutResponse = await res.json();
        setLoading(false);

        if (data.success) {
          if (data.data.canProceed) {
            setCheckoutId(data.data.checkoutId);
            setCheckoutExpiresAt(data.data.checkoutExpiresAt || null);
            setStep('seating');
          } else {
            // Still in queue, save checkoutId for next poll if provided
            setCheckoutId(data.data.checkoutId);
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Error connecting to the server');
      }
    };

    tryEnter(); // Initial call
    const interval = setInterval(tryEnter, 5000);
    return () => clearInterval(interval);
  }, [eventId, step, checkoutId]);

  useEffect(() => {
    if (!checkoutExpiresAt || step === 'completed') {
      setCheckoutTimeRemaining(null);
      return;
    };
    const interval = setInterval(() => {
      const remaining = checkoutExpiresAt - Date.now();
      if (remaining <= 0) {
        setCheckoutTimeRemaining(0);
        clearInterval(interval);
        if (eventId) {
          router.push(`/events/${eventId}`);
        }
      } else {
        setCheckoutTimeRemaining(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutExpiresAt, eventId, router, step]);

  // 3. Complete payment (calls checkout)
  const completePayment = async (selectedSeatIds: string[]) => {
    if (!checkoutId || !eventId || selectedSeatIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, seatIds: selectedSeatIds, checkoutId }),
        credentials: 'include',
      });
      const data: CheckoutResponse = await res.json();

      if (data.success) {
        setBookingId(data.data.bookingId);
        setStep('completed');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error completing payment');
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = () => {
    setStep('payment');
  };

  return {
    step,
    checkoutTimeRemaining,
    setStep,
    loading,
    error,
    bookingId,
    goToPayment,
    completePayment,
    checkoutId,
  };
}
