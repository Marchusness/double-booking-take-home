'use client';

import { Seat, Event } from '@double-booking-take-home/common';
import { 
  Armchair, 
  Clock, 
  Lock, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Search,
  ShoppingBag,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEventDetails } from '@/hooks/useEventDetails';

import { Header, Footer } from '@/components/Layout';

export function EventHero({ 
  event, 
  availableTicketsCount 
}: { 
  event: Event; 
  availableTicketsCount: number;
}) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-divider flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20"></div>
        <div className="absolute top-6 left-6">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-text-primary shadow-sm">
            Concert
          </span>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-tight">
            {event.name}
          </h1>
          <p className="text-lg text-text-secondary font-medium">Fall 2023 Tour</p>
        </div>
        
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center justify-center gap-3 text-text-primary">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-text-primary leading-none">{formattedDate}</p>
              <p className="text-sm text-text-secondary mt-1">Doors 7:00 PM • Show {formattedTime}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-text-primary">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-text-secondary">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-text-primary leading-none">{event.venue}</p>
              <p className="text-sm text-text-secondary mt-1">Brooklyn, New York</p>
            </div>
          </div>
        </div>
        
        <hr className="w-16 border-t-2 border-divider my-10" />
        
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Low Availability
            </span>
            <span className="text-sm text-text-secondary font-medium">Only {availableTicketsCount} tickets left</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">$45 - $120</p>
        </div>
        
        <button 
          onClick={() => document.getElementById('seating-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="group w-full max-w-xs bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          Select Seats
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="mt-6 text-xs text-text-secondary">
          Prices may vary by seat location. <br />All sales final.
        </p>
      </div>
    </div>
  );
}

export function SeatingChart({ 
  seats, 
  onHold 
}: { 
  seats: Seat[]; 
  onHold: (seatId: string) => void;
}) {
  return (
    <div id="seating-section" className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-divider p-8 md:p-12 mt-12">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Select Your Seats</h2>
        <p className="text-text-secondary">Click on an available seat to start your booking</p>
        <div className="w-full h-2 bg-divider rounded-full mt-8 mb-4 max-w-md mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-300 opacity-50 flex items-center justify-center text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Stage
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-12">
        {seats.map((seat) => {
          const isHeld = seat.status === 'held' && !!(seat.heldUntil && new Date(seat.heldUntil) > new Date());
          const isBooked = seat.status === 'booked';
          const isAvailable = seat.status === 'available';

          return (
            <button
              key={seat.id}
              onClick={() => isAvailable ? onHold(seat.id) : null}
              disabled={isBooked || isHeld}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all group
                ${isAvailable ? 'bg-white border-2 border-green-500 text-green-700 hover:bg-green-50 hover:scale-105' : ''}
                ${isHeld ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700 cursor-not-allowed' : ''}
                ${isBooked ? 'bg-gray-100 border-2 border-gray-300 text-text-secondary cursor-not-allowed' : ''}
              `}
              title={`Seat ${seat.row}${seat.number} - $${seat.price}`}
            >
              <Armchair className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1">{seat.row}{seat.number}</span>
              
              {isHeld && (
                <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white rounded-full p-0.5 shadow-sm">
                  <Clock className="w-3 h-3" />
                </div>
              )}
              {isBooked && (
                <div className="absolute -top-1.5 -right-1.5 bg-gray-400 text-white rounded-full p-0.5 shadow-sm">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-6 border-t border-divider pt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
          <span className="text-xs font-medium text-text-secondary">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
          <span className="text-xs font-medium text-text-secondary">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
          <span className="text-xs font-medium text-text-secondary">Booked</span>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;
  const router = useRouter();
  const { 
    event, 
    seats, 
    loading, 
    message, 
    handleHold 
  } = useEventDetails(eventId);

  const onHold = async (seatId: string) => {
    const result = await handleHold(seatId);
    if (result.success) {
      router.push(`/checkout?eventId=${eventId}&seatId=${seatId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background-light flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
            <Link href="/events" className="mt-4 text-orange-600 hover:underline inline-flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Return to events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availableTicketsCount = seats.filter(s => s.status === 'available').length;

  return (
    <div className="bg-background font-display min-h-screen flex flex-col text-text-primary antialiased selection:bg-orange-100 selection:text-orange-900">
      <Header />
      
      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl mb-8">
          <Link 
            href="/events" 
            className="inline-flex items-center text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
        </div>

        {message && (
          <div className={`w-full max-w-4xl mb-8 p-4 rounded-xl border ${
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        <EventHero event={event} availableTicketsCount={availableTicketsCount} />
        
        <SeatingChart seats={seats} onHold={onHold} />
      </main>

      <Footer />
    </div>
  );
}
