import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAILS } from "../config/adminEmails";

export default function Navbar({ townSlug = "playas-del-coco" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate(`/p/${townSlug}`);
    window.location.reload();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-info d-flex align-items-center gap-2"
          to={`/p/${townSlug}`}
          onClick={closeMenu}
        >
          <span
            className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px" }}
          >
            ☼
          </span>
          Turismo Local POC
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/places/${townSlug}`}
                onClick={closeMenu}
              >
                Lugares
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/map/${townSlug}`}
                onClick={closeMenu}
              >
                Mapa
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/qr/${townSlug}`}
                onClick={closeMenu}
              >
                Mi QR
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/admin/dashboard"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            {user ? (
              <>
                <span className="small text-muted text-center text-lg-start">
                  Hola, {user.name || user.email || "Usuario"}
                </span>

                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="Usuario"
                    className="rounded-circle mx-auto mx-lg-0"
                    style={{ width: "38px", height: "38px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mx-lg-0"
                    style={{ width: "38px", height: "38px" }}
                  >
                    U
                  </div>
                )}

                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <Link
                className="btn btn-warning rounded-pill px-4 fw-semibold"
                to={`/p/${townSlug}`}
                onClick={closeMenu}
              >
                Empezar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}