'use client';

import { useState, useEffect, useCallback } from 'react';
import { FrontendSeat, GetSeatingPlanResponse, AttemptClaimSeatResponse, UnclaimSeatResponse } from '@double-booking-take-home/common';

export function useSeatingPlan(eventId: string | null, checkoutId: string | null) {
  const [seatingPlan, setSeatingPlan] = useState<FrontendSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeatingPlan = useCallback(async () => {
    if (!eventId) return;

    try {
      const url = new URL(`http://localhost:3001/api/seating-plan/${eventId}`);
      if (checkoutId) {
        url.searchParams.append('checkoutId', checkoutId);
      }

      const res = await fetch(url.toString(), {
        credentials: 'include',
      });
      const data: GetSeatingPlanResponse = await res.json();

      if (data.success) {
        setSeatingPlan(data.data.seatingPlan);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error fetching seating plan');
    } finally {
      setLoading(false);
    }
  }, [eventId, checkoutId]);

  useEffect(() => {
    fetchSeatingPlan();
    const interval = setInterval(fetchSeatingPlan, 5000);
    return () => clearInterval(interval);
  }, [fetchSeatingPlan]);

  const addSeat = async (seatId: string) => {
    if (!eventId || !checkoutId) return;

    try {
      const res = await fetch('http://localhost:3001/api/attempt-claim-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, seatId, checkoutId }),
        credentials: 'include',
      });
      const data: AttemptClaimSeatResponse = await res.json();

      if (data.success) {
        await fetchSeatingPlan();
        return data.data.seat;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Error claiming seat');
      return null;
    }
  };

  const removeSeat = async (seatId: string) => {
    if (!eventId || !checkoutId) return;

    try {
      const res = await fetch('http://localhost:3001/api/unclaim-seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, seatId, checkoutId }),
        credentials: 'include',
      });
      const data: UnclaimSeatResponse = await res.json();

      if (data.success) {
        await fetchSeatingPlan();
        // todo: update the seating plan with the new seat
        return data.data.seat;
      } else {
        setError(data.error);
        return false;
      }
    } catch (err) {
      setError('Error unclaiming seat');
      return false;
    }
  };

  return {
    seatingPlan,
    loading,
    error,
    addSeat,
    removeSeat,
    refresh: fetchSeatingPlan,
  };
}
