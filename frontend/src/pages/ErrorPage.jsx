import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "default";

  const errors = {
    "not-found": {
      title: "Pueblo no encontrado",
      message: "Parece que este rincón de la aventura aún no ha sido explorado o el enlace no existe.",
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80"
    },
    "session-expired": {
      title: "Sesión expirada",
      message: "Tu sesión terminó por seguridad. Vuelve a iniciar sesión para continuar explorando.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    },
    "backend-offline": {
      title: "Servidor no disponible",
      message: "No pudimos conectar con el backend. Revisa que el servidor esté encendido.",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
    },
    unauthorized: {
      title: "Acceso no autorizado",
      message: "No tienes permisos para entrar a esta sección.",
      image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80"
    },
    default: {
      title: "Algo salió mal",
      message: "Ocurrió un error inesperado. Intentemos volver al inicio.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    }
  };

  const currentError = errors[reason] || errors.default;

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar townSlug="playas-del-coco" />

      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="text-center" style={{ maxWidth: 780 }}>
          <div className="position-relative d-inline-block mb-4">
            <img
              src={currentError.image}
              alt={currentError.title}
              className="img-fluid rounded-5 shadow"
              style={{ maxHeight: 300, width: 620, objectFit: "cover" }}
            />

            <div
              className="position-absolute bottom-0 end-0 translate-middle-y bg-warning text-dark rounded-4 shadow d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64, fontSize: 28 }}
            >
              🗺
            </div>
          </div>

          <h1 className="display-5 fw-bold mb-3">
            {currentError.title}
          </h1>

          <p className="lead text-muted mb-5">
            {currentError.message}
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Link to="/p/playas-del-coco" className="btn btn-info text-white rounded-pill px-5 py-3 fw-bold">
              Volver al inicio
            </Link>

            <Link to="/places/playas-del-coco" className="btn btn-outline-secondary rounded-pill px-5 py-3 fw-bold">
              Explorar lugares
            </Link>
          </div>

          <p className="small text-muted mt-5">
            ¿Crees que esto es un error? Contacta a soporte.
          </p>
        </div>
      </main>

      <footer className="py-4 bg-white border-top text-center text-muted small">
        © 2026 Turismo Local POC. Costa Rica.
      </footer>
    </div>
  );
}