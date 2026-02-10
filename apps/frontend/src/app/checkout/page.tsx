'use client';

import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Event, FrontendSeat } from '@double-booking-take-home/common';
import { QueueStep } from './components/QueueStep';
import { SeatingStep } from './components/SeatingStep';
import { PaymentStep } from './components/PaymentStep';
import { CompletedStep } from './components/CompletedStep';
import { CheckoutOverlay } from './components/CheckoutOverlay';
import { useCheckoutSession } from '@/hooks/useCheckoutSession';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useSeatingPlan } from '@/hooks/useSeatingPlan';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const {
    step,
    setStep,
    loading,
    error,
    checkoutId,
    bookingId,
    goToPayment,
    completePayment,
    checkoutTimeRemaining,
  } = useCheckoutSession(eventId);

  const { event, loading: eventLoading, error: eventError } = useEventDetails(eventId);
  const { seatingPlan, addSeat, removeSeat, loading: seatingLoading } = useSeatingPlan(eventId, checkoutId);

  const selectedSeats = seatingPlan.filter(seat => seat.status === 'heldByCurrentCheckoutSession');

  const handleSelectSeat = async (seat: FrontendSeat) => {
    if (seat.status === 'heldByCurrentCheckoutSession') {
      await removeSeat(seat.id);
    } else {
      await addSeat(seat.id);
    }
  };

  if (eventLoading || loading || seatingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || eventError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-6">{error ?? eventError}</p>
          <Link href="/events" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  switch (step) {
    case 'queue':
      return <QueueStep event={event} />;
    case 'seating':
      return (
        <CheckoutOverlay timeRemaining={checkoutTimeRemaining}>
          <SeatingStep 
            event={event} 
            seats={seatingPlan} 
            selectedSeats={selectedSeats} 
            onSeatSelect={handleSelectSeat} 
            onUnselectSeat={(seat) => removeSeat(seat.id)}
            onContinue={() => {
              if (selectedSeats.length > 0) goToPayment();
            }} 
          />
        </CheckoutOverlay>
      );
    case 'payment':
      return (
        <CheckoutOverlay timeRemaining={checkoutTimeRemaining}>
          <PaymentStep 
            event={event} 
            selectedSeats={selectedSeats} 
            onBack={() => setStep('seating')} 
            onComplete={() => {
              if (selectedSeats.length > 0) completePayment(selectedSeats.map(s => s.id));
            }}
          />
        </CheckoutOverlay>
      );
    case 'completed':
      return <CompletedStep bookingId={bookingId || ''} />;
    default:
      return null;
  }
}
