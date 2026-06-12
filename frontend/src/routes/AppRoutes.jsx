import { Navigate, Route, Routes } from "react-router-dom";
import TownLoginPage from "../pages/TownLoginPage";
import PlacesPage from "../pages/PlacesPage";
import QrPage from "../pages/QrPage";
import ErrorPage from "../pages/ErrorPage";
import MapPage from "../pages/MapPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminTownsPage from "../pages/AdminTownsPage";
import AdminPlacesPage from "../pages/AdminPlacesPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminReportsPage from "../pages/AdminReportsPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/p/playas-del-coco" replace />} />

      <Route path="/p/:townSlug" element={<TownLoginPage />} />

      <Route
        path="/places/:townSlug"
        element={
          <ProtectedRoute>
            <PlacesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map/:townSlug"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/qr/:townSlug"
        element={
          <ProtectedRoute>
            <QrPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/towns"
        element={
          <AdminRoute>
            <AdminTownsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/places"
        element={
          <AdminRoute>
            <AdminPlacesPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReportsPage />
          </AdminRoute>
        }
      />

      <Route path="/error" element={<ErrorPage />} />

      <Route
        path="*"
        element={<Navigate to="/error?reason=not-found" replace />}
      />
    </Routes>
  );
}