import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-info mb-3" role="status"></div>
          <p className="text-muted">Validando permisos...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/places/playas-del-coco" replace />;
  }

  return children;
}
