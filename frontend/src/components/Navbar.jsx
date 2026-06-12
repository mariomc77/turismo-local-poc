import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllTowns } from "../api/townApi";

export default function Navbar({ townSlug = "playas-del-coco" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [towns, setTowns] = useState([]);

  const activeSlug = townSlug || "playas-del-coco";
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const loadTowns = async () => {
      try {
        const data = await getAllTowns();
        setTowns(Array.isArray(data) ? data : []);
      } catch {
        setTowns([]);
      }
    };

    loadTowns();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate(`/p/${activeSlug}`);
    window.location.reload();
  };

  const handleTownChange = (event) => {
    const selectedSlug = event.target.value;

    if (!selectedSlug || selectedSlug === activeSlug) {
      return;
    }

    setMenuOpen(false);
    navigate(`/p/${selectedSlug}`);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info"
          to={`/places/${activeSlug}`}
          onClick={closeMenu}
        >
          <span
            className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center"
            style={{ width: "44px", height: "44px", fontSize: "22px" }}
          >
            ☼
          </span>
          Turismo Local POC
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/places/${activeSlug}`}
                onClick={closeMenu}
              >
                Lugares
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/map/${activeSlug}`}
                onClick={closeMenu}
              >
                Mapa
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={`/qr/${activeSlug}`}
                onClick={closeMenu}
              >
                Mi QR
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold text-info"
                  to="/admin/dashboard"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select form-select-sm"
              value={activeSlug}
              onChange={handleTownChange}
              style={{ maxWidth: "190px" }}
              aria-label="Seleccionar pueblo"
            >
              {towns.length === 0 && (
                <option value={activeSlug}>Pueblo actual</option>
              )}

              {towns.map((town) => (
                <option key={town.slug} value={town.slug}>
                  {town.name}
                </option>
              ))}
            </select>

            {user ? (
              <>
                <span className="text-muted d-none d-lg-inline">
                  Hola, {user.name || user.email || "Usuario"}
                </span>

                <span
                  className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold overflow-hidden"
                  style={{ width: "42px", height: "42px" }}
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "Usuario"}
                      className="rounded-circle"
                      style={{
                        width: "42px",
                        height: "42px",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                className="btn btn-info text-white btn-sm"
                to={`/p/${activeSlug}`}
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