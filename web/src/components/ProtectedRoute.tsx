import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useSession.ts";

export default function ProtectedRoute() {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render child route
  return <Outlet />;
}
