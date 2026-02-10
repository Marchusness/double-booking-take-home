'use client';

import { ArrowLeft, User, X, Check, Armchair } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/Layout';
import { Seat, Event, FrontendSeat } from '@double-booking-take-home/common';

export function SeatingStep({
  event,
  seats,
  selectedSeats,
  onSeatSelect,
  onUnselectSeat,
  onContinue
}: {
  event: Event | null;
  seats: FrontendSeat[];
  selectedSeats: FrontendSeat[];
  onSeatSelect: (seat: FrontendSeat) => void;
  onUnselectSeat: (seat: FrontendSeat) => void;
  onContinue: () => void;
}) {
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFees = selectedSeats.length > 0 ? 12.50 : 0;
  const total = subtotal + serviceFees;

  return (
    <div className="bg-white font-display min-h-screen flex flex-col text-gray-900 antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/events" className="flex size-8 items-center justify-center rounded-lg bg-gray-900 text-white transition hover:bg-black">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-gray-900 sm:text-base">{event?.name}</h1>
              <p className="text-xs text-gray-500">{event ? new Date(event.date).toLocaleDateString() : ''} • {event?.venue}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Step 2 of 3</p>
              <p className="text-sm font-bold text-gray-900">Seat Selection</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-400">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex-1 rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-10">
              <div className="mb-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded border border-gray-300 bg-white"></div>
                  <span className="text-sm font-medium text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-primary shadow-sm shadow-orange-200"></div>
                  <span className="text-sm font-medium text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded bg-gray-200 text-gray-400">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Taken</span>
                </div>
              </div>

              <div className="mb-12 flex flex-col items-center">
                <div className="h-12 w-full max-w-2xl rounded-t-[50%] bg-gradient-to-b from-gray-200 to-gray-100 shadow-inner"></div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Stage</p>
              </div>

              <div className="mx-auto max-w-3xl">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                  {seats.map((seat) => {
                    const isSelected = seat.status === 'heldByCurrentCheckoutSession';
                    const isTaken = seat.status === 'notAvailable';
                    
                    return (
                      <button
                        key={seat.id}
                        disabled={isTaken}
                        onClick={() => onSeatSelect(seat)}
                        className={`
                          relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all
                          ${isSelected ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2 scale-105' : 
                            isTaken ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                            'bg-white border border-gray-300 hover:border-primary hover:shadow-md'}
                        `}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : isTaken ? <X className="w-4 h-4" /> : <Armchair className="w-4 h-4" />}
                        <span className="text-[10px] font-bold mt-1">{seat.row}{seat.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full lg:sticky lg:top-24 lg:w-96">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-6">
                  {selectedSeats.length > 0 ? (
                    <div className="mb-6 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Selected Tickets ({selectedSeats.length})</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {selectedSeats.map(seat => (
                          <div key={seat.id} className="group flex items-center justify-between rounded-lg border border-orange-200 bg-white p-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">Sec A, Row {seat.row}</span>
                                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">STD</span>
                              </div>
                              <div className="text-sm text-gray-500">Seat {seat.number}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900">${seat.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 border-t border-gray-100 py-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Service Fees</span>
                          <span>${serviceFees.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-black text-gray-900">${total.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">USD</p>
                        </div>
                      </div>
                      <button 
                        onClick={onContinue}
                        className="mt-6 w-full rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-primary-hover hover:shadow-orange-300 active:scale-[0.98]"
                      >
                        Go to Checkout
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      <Armchair className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Select a seat to continue</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
