'use client';

import { useEvents } from '@/hooks/useEvents';
import { EventItem } from '@/components/EventItem';

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  return (
    <div className="bg-background font-display min-h-screen flex flex-col text-text-primary">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-divider">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-text-primary">
              Events<span className="text-primary">.</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Upcoming Events
            </h1>
            <p className="mt-2 text-text-secondary">
              Browse our curated list of upcoming performances and games.
            </p>
          </div>

          <div className="flex flex-col border-t border-divider">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-divider mt-6">
                <p className="text-text-secondary">No events found.</p>
              </div>
            ) : (
              events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))
            )}
          </div>

        </section>
      </main>

      <footer className="border-t border-divider py-12 bg-white">
        <div className="mx-auto max-w-4xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-sm text-text-secondary">
            © 2026 VIBE UI Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}
