import Link from 'next/link';
import { Event } from '@double-booking-take-home/common';

export function EventItem({
  event,
}: {
  event: Event;
}) {
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate().toString().padStart(2, '0');
  const time = eventDate.toLocaleTimeString('default', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-divider hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg">
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-gray-50 text-text-primary border border-divider">
          <span className="text-xs font-bold uppercase text-text-secondary">{month}</span>
          <span className="text-xl font-bold">{day}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-hover transition-colors">
            {event.name}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-text-secondary">
            <span>{event.venue}</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center justify-end">
        <Link 
          href={`/events/${event.id}`}
          className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-sm font-semibold transition-all shadow-sm active:scale-95 text-center"
        >
          Get Tickets
        </Link>
      </div>
    </div>
  );
}
