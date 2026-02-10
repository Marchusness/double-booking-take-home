'use client';

import { Check, Lock, CreditCard, HelpCircle, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/Layout';
import { FrontendSeat, Event } from '@double-booking-take-home/common';

export function PaymentStep({
  event,
  selectedSeats,
  onBack,
  onComplete
}: {
  event: Event | null;
  selectedSeats: FrontendSeat[];
  onBack: () => void;
  onComplete: () => void;
}) {
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFees = selectedSeats.length > 0 ? 12.50 : 0;
  const total = subtotal + serviceFees;
  
  return (
    <div className="bg-white font-display min-h-screen text-text-dark flex flex-col">
      <header className="border-b border-gray-200 py-5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <Check className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-dark">EventCheckout</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-dark">First Name</label>
                  <input 
                    className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                    value="Jane" 
                    readOnly 
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-dark">Last Name</label>
                  <input 
                    className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                    value="Doe" 
                    readOnly 
                    type="text"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-text-dark">Email Address</label>
                  <input 
                    className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                    value="jane.doe@example.com" 
                    readOnly 
                    type="email"
                  />
                  <p className="text-xs text-gray-500">Tickets will be sent to this email address.</p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-gray-200"></div>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">2</span>
                Payment Details
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Credit Card</span>
                  <div className="flex gap-2 text-gray-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-dark">Card Number</label>
                    <div className="relative">
                      <input 
                        className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 pl-10 text-sm text-gray-500 cursor-not-allowed" 
                        value="4242 4242 4242 4242" 
                        readOnly 
                        type="text"
                      />
                      <CreditCard className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-text-dark">Expiration Date</label>
                      <input 
                        className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                        value="12 / 28" 
                        readOnly 
                        type="text"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-text-dark">CVC</label>
                      <div className="relative">
                        <input 
                          className="w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" 
                          value="123" 
                          readOnly 
                          type="text"
                        />
                        <HelpCircle className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 cursor-help" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button 
                onClick={onComplete}
                className="w-full rounded-lg bg-primary px-6 py-4 text-center font-bold text-white hover:bg-primary-hover shadow-lg shadow-orange-200 transition-all text-lg"
              >
                Place Order · ${total.toFixed(2)}
              </button>
              <button 
                onClick={onBack}
                className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-900"
              >
                Back to Seat Selection
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  <img alt="Concert" className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop"/>
                </div>
                <div>
                  <h4 className="font-bold text-text-dark">{event?.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{event ? new Date(event.date).toLocaleDateString() : ''}</p>
                  <p className="text-sm text-gray-500">{event?.venue}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between">
                    <span className="text-text-dark">Seat {seat.row}{seat.number}</span>
                    <span className="font-medium">${seat.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="font-medium text-gray-500">${serviceFees.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-end justify-between">
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Total due</span>
                  <span className="text-2xl font-black text-text-dark">${total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">USD</div>
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-lg bg-white border border-gray-200 p-3">
                <ShieldCheck className="text-green-600 w-5 h-5" />
                <div>
                  <p className="text-xs font-bold text-text-dark">100% Buyer Guarantee</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Your tickets will arrive in time for the event and be valid for entry.</p>
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
