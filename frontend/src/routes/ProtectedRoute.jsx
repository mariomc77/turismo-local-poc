import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    const parts = location.pathname.split("/");
    const townSlug = parts[2] || "playas-del-coco";

    return <Navigate to={`/p/${townSlug}`} replace />;
  }

  return children;
}