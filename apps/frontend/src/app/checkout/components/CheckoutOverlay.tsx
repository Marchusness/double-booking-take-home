'use client';

import { Timer } from 'lucide-react';
import { ReactNode } from 'react';

export function CheckoutOverlay({
  children,
  timeRemaining,
}: {
  children: ReactNode;
  timeRemaining: number | null;
}) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen">
      {children}
      
      {timeRemaining !== null && (
        <div className="fixed bottom-6 left-6 z-[60]">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl">
            <div className={`flex size-10 items-center justify-center rounded-full ${timeRemaining < 60000 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Time Remaining</p>
              <p className={`text-lg font-black tabular-nums ${timeRemaining < 60000 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
