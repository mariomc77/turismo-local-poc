import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/p/playas-del-coco" replace />;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/places/playas-del-coco" replace />;
  }

  return children;
}