import { useSearchParams, useNavigate } from "react-router-dom";

const REASON_MESSAGES = {
  "no-pueblo":  "El código QR escaneado no contiene un identificador de pueblo válido.",
  "not-found":  "El código QR escaneado no corresponde a un pueblo registrado en nuestro sistema, o tu sesión ha expirado.",
  "expired":    "Tu sesión ha expirado. Por favor volvé a escanear el código QR e iniciá sesión nuevamente.",
  "no-connection": "No se pudo conectar con el servidor. Verificá tu conexión a internet e intentá de nuevo.",
};

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reason  = searchParams.get("reason") || "not-found";
  const message = REASON_MESSAGES[reason] || REASON_MESSAGES["not-found"];

  function handleRetry() {
    window.location.reload();
  }

  function handleHome() {
    navigate("/");
  }

  return (
    <div style={styles.page}>

      {/* Navbar simple (sin usuario) */}
      <nav style={styles.nav}>
        <span style={styles.navBrand}>Turismo Local UNA</span>
      </nav>

      {/* Contenido */}
      <main style={styles.main}>
        <div style={styles.card}>

          {/* Ilustración + número 404 */}
          <div style={styles.heroRow}>
            {/* Explorador SVG inline (fiel al mockup) */}
            <svg width="130" height="150" viewBox="0 0 130 150" style={styles.illustration}
              xmlns="http://www.w3.org/2000/svg">
              {/* Cuerpo */}
              <ellipse cx="65" cy="120" rx="28" ry="18" fill="#c8a97e" />
              {/* Piernas */}
              <rect x="50" y="128" width="12" height="18" rx="6" fill="#7b5e3a" />
              <rect x="68" y="128" width="12" height="18" rx="6" fill="#7b5e3a" />
              {/* Torso */}
              <rect x="42" y="90" width="46" height="36" rx="10" fill="#e8c87a" />
              {/* Brazos */}
              <rect x="22" y="92" width="24" height="10" rx="5" fill="#e8c87a" />
              <rect x="84" y="92" width="24" height="10" rx="5" fill="#e8c87a" />
              {/* Mapa en mano izquierda */}
              <rect x="10" y="96" width="18" height="14" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5" />
              <line x1="13" y1="101" x2="24" y2="101" stroke="#aaa" strokeWidth="1" />
              <line x1="13" y1="105" x2="21" y2="105" stroke="#aaa" strokeWidth="1" />
              {/* Brújula mano derecha */}
              <circle cx="112" cy="99" r="8" fill="#fff" stroke="#ccc" strokeWidth="1.5" />
              <line x1="112" y1="93" x2="112" y2="105" stroke="#e74c3c" strokeWidth="1.5" />
              <line x1="106" y1="99" x2="118" y2="99" stroke="#555" strokeWidth="1.5" />
              {/* Cabeza */}
              <circle cx="65" cy="76" r="22" fill="#f5cba7" />
              {/* Sombrero */}
              <ellipse cx="65" cy="58" rx="26" ry="5" fill="#7b5e3a" />
              <rect x="50" y="44" width="30" height="16" rx="6" fill="#9b7340" />
              {/* Ojos */}
              <circle cx="57" cy="76" r="3" fill="#333" />
              <circle cx="73" cy="76" r="3" fill="#333" />
              {/* Boca */}
              <path d="M58 84 Q65 89 72 84" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Signo de interrogación */}
              <text x="88" y="52" fontSize="22" fontWeight="900" fill="#e74c3c">?</text>
            </svg>

            <span style={styles.code404}>404</span>
          </div>

          {/* Título */}
          <h1 style={styles.title}>¡Ups! Pueblo no encontrado</h1>

          {/* Mensaje */}
          <p style={styles.message}>{message}</p>

          {/* Alerta de posibles causas */}
          <div style={styles.alertBox}>
            <span style={styles.alertIcon}>⚠️</span>
            <span style={styles.alertText}>
              Posibles causas: QR inválido, sin conexión a internet, sesión expirada
            </span>
          </div>

          {/* Botones */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleHome}>
              Volver al inicio
            </button>
            <button style={styles.btnSecondary} onClick={handleRetry}>
              Reintentar conexión
            </button>
          </div>

          {/* Nota de soporte */}
          <p style={styles.support}>
            Si el problema persiste contacta a soporte técnico.
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#eef2f7",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  // Navbar
  nav: {
    backgroundColor: "#1a4a8a",
    padding: "0 24px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  navBrand: {
    color: "white",
    fontSize: "1.1rem",
    fontWeight: "700",
  },

  // Main
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
    padding: "48px 40px",
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },

  // Hero row: explorador + 404
  heroRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  illustration: {
    flexShrink: 0,
  },
  code404: {
    fontSize: "6rem",
    fontWeight: "900",
    color: "#1a4a8a",
    lineHeight: 1,
    letterSpacing: "-2px",
  },

  // Textos
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#1a2e4a",
  },
  message: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#555",
    lineHeight: 1.6,
    maxWidth: "380px",
  },

  // Alerta
  alertBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fffbea",
    border: "1px solid #f5c842",
    borderRadius: "8px",
    padding: "12px 18px",
    width: "100%",
    boxSizing: "border-box",
  },
  alertIcon: { fontSize: "1.1rem", flexShrink: 0 },
  alertText: {
    fontSize: "0.85rem",
    color: "#7a5c00",
    textAlign: "left",
    lineHeight: 1.4,
  },

  // Botones
  btnRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btnPrimary: {
    padding: "11px 28px",
    backgroundColor: "#1a4a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "11px 28px",
    backgroundColor: "#fff",
    color: "#1a4a8a",
    border: "2px solid #1a4a8a",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Soporte
  support: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#999",
  },
};