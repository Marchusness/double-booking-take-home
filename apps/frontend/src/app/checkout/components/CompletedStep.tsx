'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CompletedStep({ 
  bookingId 
}: { 
  bookingId: string 
}) {
  return (
    <div className="bg-gray-50 font-display min-h-screen flex flex-col items-center justify-center text-text-primary p-4">
      <main className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            Thank you for your purchase. Your tickets have been sent to your email.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Booking ID</p>
            <p className="text-xl font-mono font-bold text-gray-900">{bookingId}</p>
          </div>

          <Link 
            href="/events" 
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gray-900 px-6 py-4 text-base font-bold text-white transition-all hover:bg-black active:scale-[0.98]"
          >
            Back to Events
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>© 2026 VIBE UI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
