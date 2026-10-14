import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("admin_token");
  const userData = localStorage.getItem("admin_user");

  if (!token || !userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  let user: any = null;
  try {
    user = JSON.parse(userData);
  } catch {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Must have a valid role and be SUPER_ADMIN or SELLER
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "SELLER")) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If route is restricted to specific roles (e.g. SUPER_ADMIN for /users and /trash)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
