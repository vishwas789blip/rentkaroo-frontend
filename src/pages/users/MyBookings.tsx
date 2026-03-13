import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import apiClient from "@/services/api";
import { CalendarDays, MapPin, AlertCircle } from "lucide-react";

// Types remain the same...
interface Booking {
  _id: string;
  listing?: {
    title: string;
    location: string;
    images?: { url: string }[];
  };
  price: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError(null);
        const res = await apiClient.get("/bookings/my");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CalendarDays className="text-blue-600" size={24} />
          My Bookings
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-gray-500 italic">You haven't booked any PG yet.</p>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Extracted Sub-component for better maintainability
function BookingCard({ booking }: { booking: Booking }) {
  const isConfirmed = booking.status === "confirmed";
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border">
      <div className="relative">
        <img
          src={booking.listing?.images?.[0]?.url || "https://placehold.co/600x400"}
          alt="PG"
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isConfirmed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {booking.status}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h2 className="font-bold text-lg leading-tight truncate">
          {booking.listing?.title || "PG Listing"}
        </h2>

        <p className="text-gray-500 flex items-center gap-1 text-sm">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{booking.listing?.location || "Location not available"}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50 text-xs">
          <div>
            <p className="text-gray-400 uppercase font-semibold">Check-in</p>
            <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 uppercase font-semibold">Check-out</p>
            <p className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-2xl font-bold text-blue-600">₹{booking.price}</span>
          <button className="text-sm font-medium text-gray-600 hover:text-blue-600 underline">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}