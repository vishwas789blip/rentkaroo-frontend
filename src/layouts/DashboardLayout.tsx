import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  PlusCircle,
  BarChart3,
  List,
  Headset,
  LogOut
} from "lucide-react";

/* ================= LINKS CONFIG ================= */
const userLinks = [
  { to: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/user/bookings", label: "My Bookings", icon: CalendarDays },
  { to: "/dashboard/user/settings", label: "Settings", icon: Settings },
];

const ownerLinks = [
  { to: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/owner/create", label: "Add Listing", icon: PlusCircle },
  { to: "/dashboard/owner/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/admin/support", label: "Support", icon: Headset },
  { to: "/dashboard/admin/listings", label: "All Listings", icon: List },
  { to: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const DashboardLayout = ({ children }: any) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "pg_owner"
      ? ownerLinks
      : userLinks;

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <div className="flex flex-1 container mx-auto px-0 lg:px-6 lg:py-8 gap-8">
        {/* ================= SIDEBAR (DESKTOP) ================= */}
        <aside className="hidden lg:flex w-72 flex-col shrink-0 sticky top-24 h-[calc(100vh-8rem)] bg-white border border-[#e0f2ec] rounded-[2.5rem] p-6 shadow-sm">
          <div className="px-4 mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0fb478]">Dashboard</p>
          </div>

          <nav className="flex-1 space-y-2">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all group ${
                    active
                      ? "bg-[#0fb478] text-white shadow-lg shadow-emerald-100"
                      : "text-[#4a635d] hover:bg-[#f0f9f6] hover:text-[#0fb478]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-white" : "text-[#0fb478] group-hover:scale-110 transition-transform"}`} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto pt-6 border-t border-[#e0f2ec]">
            <button 
              onClick={logout}
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 bg-white lg:rounded-[2.5rem] border-x lg:border border-[#e0f2ec] shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>

      {/* ================= MOBILE NAV (TAB BAR) ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0f2ec] px-6 py-3 z-50 flex justify-around items-center">
        {links.map(({ to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link 
              key={to} 
              to={to} 
              className={`p-3 rounded-2xl transition-all ${active ? "bg-[#f0f9f6] text-[#0fb478]" : "text-[#4a635d]"}`}
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        })}
      </div>
      {/* Spacer for mobile nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default DashboardLayout;