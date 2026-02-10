'use client';

import { Hourglass, Info } from 'lucide-react';
import { Event } from '@double-booking-take-home/common';

export function QueueStep({ 
  event, 
}: { 
  event: Event | null; 
}) {
  return (
    <div className="bg-gray-50 font-display min-h-screen flex flex-col items-center justify-center text-text-primary p-4">
      <main className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-2 w-full bg-orange-100">
          <div 
            className="h-full bg-primary transition-all duration-1000 w-[100%]" 
          ></div>
        </div>
        <div className="p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-primary">
            <Hourglass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">
            You are now in line
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            In queue for <span className="font-semibold text-gray-900">{event?.name || 'The Event'}</span>
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5 shrink-0 w-5 h-5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Do not refresh this page</p>
              <p className="opacity-90 leading-relaxed">You will lose your place in line if you refresh or close your browser. When it's your turn, you will have 10 minutes to complete your purchase.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Ticket ID: #8829-QUE</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Connected
          </span>
        </div>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>© 2026 VIBE UI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
