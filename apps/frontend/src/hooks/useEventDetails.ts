'use client';

import { useEffect, useState, useCallback } from 'react';
import { Seat, Event, EventDetailsResponse, GetSeatingPlanResponse, FrontendSeat } from '@double-booking-take-home/common';

export function useEventDetails(eventId: string | null, refreshInterval?: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<FrontendSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetailsData = useCallback(async () => {
    if (!eventId) {
      setError('Event ID is required');
      return;
    };
    try {
      const res = await fetch(`http://localhost:3001/api/event-details/${eventId}`, {
        credentials: 'include',
      });
      const data = await res.json() as EventDetailsResponse;
      if (data.success) {
        setEvent(data.data.event);
      } else {
        setError(data.error || 'Failed to fetch event details');
      }
    } catch (err) {
      setError('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const fetchSeatingPlanData = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await fetch(`http://localhost:3001/api/seating-plan/${eventId}`, {
        credentials: 'include',
      });
      const data = await res.json() as GetSeatingPlanResponse;
      if (data.success) {
        setSeats(data.data.seatingPlan);
      } else {
        setError(data.error || 'Failed to fetch seating plan');
      }
    } catch (err) {
      setError('Error connecting to the server');
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetailsData();
    fetchSeatingPlanData();
    if (refreshInterval) {
      const interval = setInterval(() => {
        fetchEventDetailsData();
        fetchSeatingPlanData();
      }, refreshInterval); // Poll for updates
      return () => clearInterval(interval);
    }
  }, [fetchEventDetailsData, refreshInterval]);

  return {
    event,
    seats,
    loading,
    error,
    refresh: () => {
      fetchEventDetailsData();
      fetchSeatingPlanData();
    },
  };
}
