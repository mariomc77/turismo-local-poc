import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getAllTowns } from "../api/townApi";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ townSlug = "playas-del-coco" }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const userName = user?.name || user?.email || "Usuario";
  const userPicture = user?.picture || user?.pictureUrl || "";
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
          aria-label={t("app.name")}
        >
          <span
            className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "44px", height: "44px", fontSize: "22px" }}
            aria-hidden="true"
          >
            ☼
          </span>

          <span className="d-none d-sm-inline">{t("app.name")}</span>
          <span className="d-inline d-sm-none">Turismo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
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
                {t("navbar.places")}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-nowrap"
                to={`/map/${activeSlug}`}
                onClick={closeMenu}
              >
                {t("navbar.map")}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-nowrap"
                to={`/qr/${activeSlug}`}
                onClick={closeMenu}
              >
                {t("navbar.qr")}
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold text-info text-nowrap"
                  to="/admin/dashboard"
                  onClick={closeMenu}
                >
                  {t("navbar.admin")}
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
              aria-label={t("navbar.town")}
            >
              {towns.length === 0 && (
                <option value={activeSlug}>{t("navbar.town")}</option>
              )}

              {towns.map((town) => (
                <option key={town.slug} value={town.slug}>
                  {town.name}
                </option>
              ))}
            </select>

            <LanguageSwitcher />

            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span
                  className="text-muted text-truncate d-none d-md-inline"
                  style={{ maxWidth: "190px" }}
                  title={userName}
                >
                  {userName}
                </span>

                <span
                  className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold overflow-hidden flex-shrink-0"
                  style={{ width: "42px", height: "42px" }}
                  aria-label={userName}
                  title={userName}
                >
                  {userPicture ? (
                    <img
                      src={userPicture}
                      alt={userName}
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
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-nowrap"
                  onClick={handleLogout}
                >
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link
                className="btn btn-info text-white btn-sm text-nowrap"
                to={`/p/${activeSlug}`}
                onClick={closeMenu}
              >
                {t("navbar.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}