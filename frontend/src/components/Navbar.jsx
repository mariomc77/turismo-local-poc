import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info" to="/">
          <span
            className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center"
            style={{ width: "44px", height: "44px", fontSize: "22px" }}
          >
            ☀
          </span>
          Turismo Local POC
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/places/playas-del-coco">
                Lugares
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/map/playas-del-coco">
                Mapa
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/qr/playas-del-coco">
                Mi QR
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-info" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user && (
              <>
                <span className="text-muted">
                  Hola, {user.name}
                </span>

                <span
                  className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold"
                  style={{ width: "42px", height: "42px" }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>

                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
