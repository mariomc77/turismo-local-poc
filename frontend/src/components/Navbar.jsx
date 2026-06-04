import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ variant = "public", townSlug = "playas-del-coco" }) {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(`/p/${townSlug}`);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-info d-flex align-items-center gap-2" to={`/p/${townSlug}`}>
          <span className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
            ☼
          </span>
          Turismo Local POC
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to={`/places/${townSlug}`}>
                Lugares
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to={`/map/${townSlug}`}>
                Mapa
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to={`/qr/${townSlug}`}>
                Mi QR
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="small text-muted d-none d-md-inline">
                  Hola, {user.name || user.email || "Usuario"}
                </span>

                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="Usuario"
                    className="rounded-circle"
                    style={{ width: 36, height: 36, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36 }}
                  >
                    U
                  </div>
                )}

                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <Link className="btn btn-warning rounded-pill px-4 fw-semibold text-white" to={`/p/${townSlug}`}>
                Empezar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}