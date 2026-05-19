import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthPage from "./pages/AuthPage";
import PlacesPage from "./pages/PlacesPage";
import ErrorPage from "./pages/ErrorPage";
import { isAuthenticated } from "./services/auth";

// Protege rutas que requieren login
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Pantalla de autenticación — entrada por QR */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/p/:townId" element={<AuthPage />} />

          {/* Lista de lugares — protegida */}
          <Route
            path="/p/:townId/places"
            element={
              <ProtectedRoute>
                <PlacesPage />
              </ProtectedRoute>
            }
          />

          {/* Página de error */}
          <Route path="/error" element={<ErrorPage />} />

          {/* Cualquier ruta desconocida */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}