import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTownBySlug } from "../api/townApi";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function TownLoginPage() {
  const { townSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTown() {
      try {
        const data = await getTownBySlug(townSlug);
        setTown(data);
      } catch {
        setError("No se pudo cargar la información del pueblo.");
      } finally {
        setLoading(false);
      }
    }

    loadTown();
  }, [townSlug]);

  useEffect(() => {
    if (isAuthenticated && town) {
      navigate(`/places/${town.slug}`);
    }
  }, [isAuthenticated, town, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!town) return <ErrorMessage message="No se encontró información del pueblo." />;

  return (
    <div className="login-page">
      <header className="topbar">
        <span>Turismo Local UNA</span>
      </header>

      <main className="login-content">
        <section className="login-card">
          <div className="town-icon">🏖️</div>

          <h1>Bienvenido a {town.name}</h1>

          <p>{town.description}</p>

          <GoogleLoginButton onSuccess={() => navigate(`/places/${town.slug}`)} />

          <small>Solo se aceptan cuentas @gmail.com</small>
        </section>
      </main>

      <footer>Universidad Nacional · Programación 4</footer>
    </div>
  );
}