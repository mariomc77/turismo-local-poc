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
  };

  const handleTownChange = (event) => {
    const selectedSlug = event.target.value;

    if (!selectedSlug || selectedSlug === activeSlug) {
      return;
    }

    setMenuOpen(false);
    navigate(`/p/${selectedSlug}`);
  };

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav className="navbar navbar-expand-xl bg-white shadow-sm sticky-top">
      <div className="container-fluid px-3 px-lg-4">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info me-3"
          to={`/places/${activeSlug}`}
          onClick={closeMenu}
        >
          <span
            className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "44px", height: "44px", fontSize: "22px" }}
          >
            ☼
          </span>
          <span className="d-none d-sm-inline">Turismo Local POC</span>
          <span className="d-inline d-sm-none">Turismo</span>
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
          <ul className="navbar-nav mx-xl-auto mb-3 mb-xl-0 gap-xl-3 align-items-xl-center">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-nowrap"
                to={`/places/${activeSlug}`}
                onClick={closeMenu}
              >
                Lugares
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-nowrap"
                to={`/map/${activeSlug}`}
                onClick={closeMenu}
              >
                Mapa
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-nowrap"
                to={`/qr/${activeSlug}`}
                onClick={closeMenu}
              >
                Mi QR
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold text-info text-nowrap"
                  to="/admin/dashboard"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-xl-row align-items-xl-center gap-2 gap-xl-3 ms-xl-auto">
            <select
              className="form-select form-select-sm"
              value={activeSlug}
              onChange={handleTownChange}
              style={{ width: "190px", maxWidth: "100%" }}
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
              <div className="d-flex align-items-center gap-2">
                <span
                  className="text-muted text-truncate d-none d-md-inline"
                  style={{ maxWidth: "190px" }}
                  title={user.name || user.email || "Usuario"}
                >
                  Hola, {user.name || user.email || "Usuario"}
                </span>

                <span
                  className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold overflow-hidden flex-shrink-0"
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
                    userInitial
                  )}
                </span>

                <button
                  className="btn btn-outline-secondary btn-sm text-nowrap"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                className="btn btn-info text-white btn-sm text-nowrap"
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