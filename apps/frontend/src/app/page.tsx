import { SeatMap } from './SeatMap';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Double Booking Take Home
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Secure your seats before they're gone.
          </p>
        </header>
        
        <SeatMap />
      </div>
    </main>
  );
}

