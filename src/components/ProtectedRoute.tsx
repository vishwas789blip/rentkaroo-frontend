import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Explicitly type the roles to match your Backend & AuthContext
type UserRole = "user" | "pg_owner" | "admin";

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fbfb]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0fb478] border-t-transparent" />
          <p className="text-sm font-bold text-[#4a635d]">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If user not logged in, send to login but remember where they wanted to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role isn't in the list
if (allowedRoles.length > 0 && !allowedRoles.some(role => role.toLowerCase() === user.role.toLowerCase())) {
  return <Navigate to="/" replace />;
}
  return <>{children}</>;
};

export default ProtectedRoute;