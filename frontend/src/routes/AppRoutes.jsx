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

      <Route path="/qr/:townSlug" element={<QrPage />} />

      <Route path="/map/:townSlug" element={<MapPage />} />

      <Route path="/error" element={<ErrorPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/towns"
        element={
          <ProtectedRoute>
            <AdminTownsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/places"
        element={
          <ProtectedRoute>
            <AdminPlacesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/error?reason=not-found" replace />} />
    </Routes>
  );
}