import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { bookingAPI } from "@/services/api";
import { CalendarDays, CreditCard, MapPin, Loader2 } from "lucide-react";

// Pro-tip: Define an interface for your Booking to get full IDE autocomplete
interface Booking {
  _id: string;
  status: 'active' | 'pending' | 'approved' | 'rejected';
  totalPrice: number;
  checkInDate: string;
  pgListing?: {
    title: string;
    images?: { url: string }[];
    address?: { city: string; state: string };
  };
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getMyBookings();
        // Standardize the data shape immediately
        const data = res.data?.data || res.data || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Performance: Only recalculate when the bookings array changes
  const stats = useMemo(() => {
    const active = bookings.filter(b => b.status === "active").length;
    const spent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { active, spent };
  }, [bookings]);

  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-blue-100 text-blue-700 border-blue-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name ? user.name : 'User'} 👋          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your stays and view your transaction history.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-emerald-600 text-white p-6 shadow-md transition-transform hover:scale-[1.01]">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-medium opacity-90">Active Stays</span>
              <CalendarDays className="h-5 w-5 opacity-80" />
            </div>
            <p className="mt-4 text-4xl font-bold relative z-10">{stats.active}</p>
            {/* Decorative background circle */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10" />
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm transition-transform hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">Total Investment</span>
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900">
              ₹{stats.spent.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Bookings Section */}
        <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-semibold">Your Recent Bookings</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-muted-foreground animate-pulse">Fetching your data...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <CalendarDays className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                  Ready to move? Start exploring PGs in your favorite city.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((b) => (
                  <div 
                    key={b._id} 
                    className="group flex flex-col md:flex-row items-start md:items-center gap-5 rounded-xl border p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                  >
                    <img
                      src={b.pgListing?.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
                      alt="PG"
                      className="w-full md:w-32 h-24 rounded-lg object-cover shadow-sm"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {b.pgListing?.title || "Unnamed Listing"}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-emerald-500" />
                        <span className="truncate">
                          {b.pgListing?.address ? `${b.pgListing.address.city}, ${b.pgListing.address.state}` : 'Location TBD'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-medium text-gray-500">
                        Check-in: <span className="text-gray-900">{b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3">
                      <span className="text-lg font-bold text-emerald-700">
                        ₹{b.totalPrice?.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border font-bold ${getStatusStyles(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;