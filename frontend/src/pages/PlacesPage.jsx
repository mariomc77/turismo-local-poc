import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getUser } from "../services/auth";
import PlaceCard from "../components/PlaceCard";
import Navbar from "../components/Navbar";

const CATEGORIES = [
  "Todas",
  "Mirador",
  "Cultural",
  "Gastronomía",
  "Restaurante",
  "Parque",
  "Museo",
  "Hotel",
  "Iglesia",
];

export default function PlacesPage() {
  // Soporta tanto /p/:townId/places como ?pueblo=townId
  const { townId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const townId = paramId || searchParams.get("pueblo");

  const [town, setTown] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const user = getUser();

  // ── Carga inicial ──────────────────────────────────────────
  useEffect(() => {
    if (!townId) {
      navigate("/error?reason=no-pueblo");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const [townData, placesData] = await Promise.all([
          api.getTown(townId),
          api.getPlaces(townId),
        ]);
        setTown(townData);
        setPlaces(placesData);
      } catch {
        navigate("/error?reason=not-found");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [townId]);

  const filtered = useMemo(() => {
    let result = places;

    if (activeCategory !== "Todas") {
      result = result.filter((p) => {
        const cat = (p.categoria || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const active = activeCategory
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return cat === active;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return result.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeCategory, search, places]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <Navbar user={user} />
        <div style={styles.loadingBody}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Cargando lugares...</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <Navbar user={user} />

      {/* ── Hero ── */}
      <header style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Lugares para visitar en {town?.nombre}
          </h1>
          {town?.descripcion && (
            <p style={styles.heroSubtitle}>{town.descripcion}</p>
          )}
        </div>
      </header>

      {/* ── Controles ── */}
      <div style={styles.controls}>
        {/* Buscador */}
        <div style={styles.searchWrapper}>
          <svg
            style={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Buscar lugares..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros de categoría */}
        <div style={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.filterBtn,
                ...(activeCategory === cat ? styles.filterBtnActive : {}),
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de lugares ── */}
      <main style={styles.main}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>🔍</span>
            <p style={styles.emptyText}>
              No se encontraron lugares con ese criterio.
            </p>
            <button
              style={styles.resetBtn}
              onClick={() => {
                setSearch("");
                setActiveCategory("Todas");
              }}
            >
              Ver todos los lugares
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Estilos ────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  // Hero
  hero: {
    position: "relative",
    backgroundColor: "#1a4a8a",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px 32px 36px",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(10, 35, 80, 0.60)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: "800px",
  },
  heroTitle: {
    margin: "0 0 8px",
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#fff",
    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
  },
  heroSubtitle: {
    margin: 0,
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },

  // Controls
  controls: {
    maxWidth: "1100px",
    margin: "24px auto 0",
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
    border: "1px solid #dce3ed",
    borderRadius: "8px",
    padding: "0 14px",
    maxWidth: "420px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    padding: "10px 0",
    fontSize: "0.9rem",
    backgroundColor: "transparent",
    color: "#333",
  },
  filters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1px solid #ccd6e8",
    backgroundColor: "#fff",
    color: "#555",
    fontSize: "0.82rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterBtnActive: {
    backgroundColor: "#1a4a8a",
    color: "#fff",
    borderColor: "#1a4a8a",
  },

  // Grid
  main: {
    maxWidth: "1100px",
    margin: "24px auto 48px",
    padding: "0 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },

  // Empty state
  empty: {
    textAlign: "center",
    padding: "64px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  emptyIcon: { fontSize: "2.5rem" },
  emptyText: { color: "#666", fontSize: "1rem", margin: 0 },
  resetBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    backgroundColor: "#1a4a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  // Loading
  loadingScreen: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  loadingBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 56px)",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #dce3ed",
    borderTop: "4px solid #1a4a8a",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#555",
    fontSize: "1rem",
    margin: 0,
  },
};
