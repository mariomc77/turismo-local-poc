import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Turismo Local UNA</span>

      {user && (
        <div style={styles.userArea}>
          {user.picture ? (
            <img src={user.picture} alt={user.nombre} style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
          )}
          <span style={styles.userName}>{user.nombre}</span>
          <button style={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            {/* ícono logout */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#1a4a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "56px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  brand: {
    color: "white",
    fontSize: "1.1rem",
    fontWeight: "700",
    letterSpacing: "0.01em",
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.5)",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#3b6dbf",
    border: "2px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "0.9rem",
  },
  userName: {
    color: "white",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    opacity: 0.85,
  },
};