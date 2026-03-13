import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { listingAPI, bookingAPI } from "@/services/api";
import { Home, IndianRupee, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const OwnerDashboard = () => {
  const { user } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const listingRes = await listingAPI.getOwnerListings();
        setListings(listingRes.data?.data || []);

        const bookingRes = await bookingAPI.getOwnerBookings();
        setBookings(bookingRes.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleApprove = async (id: string) => {
    await bookingAPI.approve(id);
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "approved" } : b
      )
    );
  };

  const handleReject = async (id: string) => {
    await bookingAPI.reject(id, "Rejected by owner");
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "rejected" } : b
      )
    );
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const statusBadge = (status: string) => {
    if (status === "approved")
      return "bg-emerald-100 text-emerald-700";
    if (status === "rejected")
      return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your PG listings and booking requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2">

          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Listings</span>
              <Home className="h-5 w-5" />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {listings.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Revenue
              </span>
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="mt-4 text-3xl font-bold text-emerald-600">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Booking Requests */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Booking Requests
          </h2>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No booking requests yet.
            </p>
          ) : (
            <div className="grid gap-5">

              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col md:flex-row gap-5 rounded-xl border p-5 hover:shadow-md transition"
                >

                  {/* PG Image */}
                  <div className="w-full md:w-40 h-28 overflow-hidden rounded-lg">
                    <img
                      src={
                        b.pgListing?.images?.[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={b.pgListing?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 space-y-1">

                    <p className="font-semibold text-lg">
                      {b.pgListing?.title}
                    </p>

                    <p className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {b.pgListing?.location}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Guest: {b.user?.name}
                    </p>

                    <p className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Check-in:{" "}
                      {b.checkInDate
                        ? new Date(
                            b.checkInDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <p className="text-sm font-medium text-emerald-600">
                      ₹{(b.totalPrice || 0).toLocaleString()}
                    </p>

                  </div>

                  {/* Status + Buttons */}
                  <div className="flex flex-col items-start md:items-end gap-3">

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${statusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>

                    {b.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            handleApprove(b._id)
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleReject(b._id)
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;