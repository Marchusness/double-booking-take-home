'use client';

import { useEffect, useState, useCallback } from 'react';
import { Seat, Event } from '@double-booking-take-home/common';

export type MessageType = 'info' | 'error' | 'success';

export interface Message {
  text: string;
  type: MessageType;
}

export function useEventDetails(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/event-details/${eventId}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data.event);
        setSeats(data.data.seatingPlan);
      } else {
        setMessage({ text: data.error || 'Failed to fetch event details', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error connecting to the server', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll for updates
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleHold = async (seatId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/try-enter-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId, eventId }),
      });

      const data = await res.json();

      if (res.status === 409 || (data.success && data.data.status === 'unavailable')) {
        setMessage({ text: 'Seat already taken or held!', type: 'error' });
        return { success: false, conflict: true };
      } else if (data.success && data.data.status === 'success') {
        return { success: true };
      } else {
        setMessage({ text: data.error || 'Error holding seat', type: 'error' });
        return { success: false };
      }
    } catch (err) {
      setMessage({ text: 'Error holding seat', type: 'error' });
      return { success: false };
    }
  };

  return {
    event,
    seats,
    loading,
    message,
    setMessage,
    handleHold,
    refresh: fetchData,
  };
}
