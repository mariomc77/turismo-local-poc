import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTownBySlug } from "../api/townApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/Login.css";

export default function TownLoginPage() {
  const { townSlug } = useParams();
  const navigate = useNavigate();

  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTown() {
      try {
        const data = await getTownBySlug(townSlug);
        setTown(data);
      } catch{
        setError("No se pudo cargar la información del pueblo.");
      } finally {
        setLoading(false);
      }
    }

    loadTown();
  }, [townSlug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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

          <button
            type="button"
            className="google-btn"
            onClick={() => navigate(`/places/${town.slug}`)}
          >
            Continuar con Google
            <span className="google-g">G</span>
          </button>

          <small>Botón temporal para la demo de Fase 1</small>
        </section>
      </main>

      <footer>Universidad Nacional · Programación 4</footer>
    </div>
  );
}