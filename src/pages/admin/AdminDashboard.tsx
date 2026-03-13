import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Users, Home, IndianRupee, AlertTriangle } from "lucide-react";
import { listingAPI } from "@/services/api";
import apiClient from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

// --- Interfaces for Type Safety ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Listing {
  _id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  pricePerMonth: number;
  address?: { city: string };
  images?: { url: string }[];
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, listingsRes] = await Promise.all([
          apiClient.get("/admin/users"),
          listingAPI.getAll(),
        ]);

        // FIX: Ensure data is an array before setting state
        // This prevents the ".slice is not a function" error
        const usersData = Array.isArray(usersRes.data?.data) 
          ? usersRes.data.data 
          : [];
        
        const listingsData = Array.isArray(listingsRes.data?.data) 
          ? listingsRes.data.data 
          : [];

        setUsers(usersData);
        setListings(listingsData);
      } catch (err) {
        console.error("Admin fetch failed:", err);
        setError("Failed to fetch dashboard data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Derived state: filtered and calculated from the main listings array
  const pendingListings = listings.filter((l) => l.status === "pending");

  const totalRevenue = listings.reduce(
    (sum, l) => sum + (Number(l.pricePerMonth) || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users, listings and analytics.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={loading ? "..." : users.length}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Total Listings"
            value={loading ? "..." : listings.length}
            icon={Home}
            gradient="from-emerald-500 to-emerald-600"
          />
          <StatCard
            label="Platform Revenue"
            value={loading ? "..." : `₹${totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            label="Pending Listings"
            value={loading ? "..." : pendingListings.length}
            icon={AlertTriangle}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Main Content Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Recent Users Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Recent Users</h2>
            <div className="space-y-4">
              {loading ? (
                <TableSkeleton rows={3} />
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
              ) : (
                // Safe slice: users is guaranteed to be an array now
                users.slice(0, 5).map((u) => (
                  <div key={u._id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-muted rounded-md capitalize">{u.role}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Pending Approvals</h2>
            <div className="space-y-4">
              {loading ? (
                <TableSkeleton rows={2} />
              ) : pendingListings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No pending approvals.</p>
              ) : (
                pendingListings.map((l) => (
                  <div key={l._id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition">
                    <div className="flex items-center gap-3">
                      <img
                        src={l.images?.[0]?.url || "https://dummyimage.com/100x80/cccccc/000000&text=PG"}
                        className="h-12 w-16 rounded object-cover bg-muted"
                        alt="Listing"
                      />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.address?.city || "Unknown City"}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                      Pending
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Helper Components ---

const StatCard = ({ label, value, icon: Icon, gradient }: any) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="mt-3 text-2xl font-bold">{value}</p>
  </div>
);

const TableSkeleton = ({ rows }: { rows: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </>
);

export default AdminDashboard;