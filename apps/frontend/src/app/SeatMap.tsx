'use client';

import React, { useEffect, useState } from 'react';
import { Seat } from '@double-booking-take-home/common';
import { Armchair, CheckCircle2, Clock, Lock } from 'lucide-react';

export function SeatMap() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const fetchSeats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/seats');
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      setMessage({ text: 'Failed to fetch seats', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 3000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const handleHold = async (seatId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId }),
      });

      if (res.status === 409) {
        setMessage({ text: 'Seat already taken or held!', type: 'error' });
      } else if (res.ok) {
        setMessage({ text: 'Seat held for 60 seconds', type: 'success' });
        fetchSeats();
      }
    } catch (err) {
      setMessage({ text: 'Error holding seat', type: 'error' });
    }
  };

  const handleBook = async (seatId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId }),
      });

      if (res.ok) {
        setMessage({ text: 'Booking confirmed!', type: 'success' });
        fetchSeats();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Booking failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error booking seat', type: 'error' });
    }
  };

  if (loading) return <div className="text-center p-10">Loading seat map...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Event Seat Map</h2>
        <p className="text-gray-500">Select an available seat to hold it for 60 seconds.</p>
        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 
            message.type === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-10 gap-4 mb-10">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => seat.status === 'available' ? handleHold(seat.id) : null}
            disabled={seat.status === 'booked' || !!(seat.status === 'held' && seat.heldUntil && new Date(seat.heldUntil) < new Date())}
            className={`
              relative p-4 rounded-lg flex flex-col items-center justify-center transition-all
              ${seat.status === 'available' ? 'bg-white border-2 border-green-500 text-green-700 hover:bg-green-50' : ''}
              ${seat.status === 'held' ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700' : ''}
              ${seat.status === 'booked' ? 'bg-gray-200 border-2 border-gray-400 text-gray-500 cursor-not-allowed' : ''}
            `}
          >
            <Armchair size={24} />
            <span className="text-xs font-bold mt-1">{seat.row}{seat.number}</span>
            
            {seat.status === 'held' && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                <Clock size={12} />
              </div>
            )}
            {seat.status === 'booked' && (
              <div className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1">
                <Lock size={12} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-8 border-t pt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
          <span className="text-sm">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>

      {seats.some(s => s.status === 'held') && (
        <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-bold mb-4">Your Selections</h3>
          {seats.filter(s => s.status === 'held').map(s => (
            <div key={s.id} className="flex justify-between items-center mb-2">
              <span>Seat {s.row}{s.number} - ${s.price}</span>
              <button 
                onClick={() => handleBook(s.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Confirm Purchase
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
