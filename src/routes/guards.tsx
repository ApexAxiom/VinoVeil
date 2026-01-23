import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Route guard for authenticated pages. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="section-container">Loading account...</div>;
  }

  if (!user) {
    return <Navigate to={`/auth/sign-in?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
}

/** Route guard for admin-only pages. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="section-container">Loading account...</div>;
  }

  if (!user || !user.groups.includes("ADMINS")) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
