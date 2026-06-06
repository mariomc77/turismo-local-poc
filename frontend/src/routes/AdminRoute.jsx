import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ADMIN_EMAILS } from "../config/adminEmails";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/p/playas-del-coco" replace />;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/places/playas-del-coco" replace />;
  }

  return children;
}