
const CATEGORY_STYLES = {
  mirador:     { bg: "#f5a623", color: "#000", label: "Mirador" },
  cultural:    { bg: "#27ae60", color: "#fff", label: "Cultural" },
  gastronomia: { bg: "#e67e22", color: "#fff", label: "Gastronomía" },
  restaurante: { bg: "#e67e22", color: "#fff", label: "Restaurante" },
  parque:      { bg: "#27ae60", color: "#fff", label: "Parque" },
  museo:       { bg: "#8e44ad", color: "#fff", label: "Museo" },
  hotel:       { bg: "#16a085", color: "#fff", label: "Hotel" },
  iglesia:     { bg: "#2980b9", color: "#fff", label: "Iglesia" },
};

function getCatStyle(categoria) {
  if (!categoria) return { bg: "#7f8c8d", color: "#fff", label: "Lugar" };
  const key = categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return CATEGORY_STYLES[key] || { bg: "#7f8c8d", color: "#fff", label: categoria };
}

export default function PlaceCard({ place }) {
  const { nombre, descripcion, categoria, imagen, direccion } = place;
  const cat = getCatStyle(categoria);

  return (
    <div style={styles.card}>
      {/* Imagen */}
      <div style={styles.imageWrapper}>
        {imagen ? (
          <img src={imagen} alt={nombre} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>📷</div>
        )}
      </div>

      {/* Contenido */}
      <div style={styles.body}>
        <h3 style={styles.title}>{nombre}</h3>

        {/* Badge de categoría */}
        <span style={{ ...styles.badge, backgroundColor: cat.bg, color: cat.color }}>
          {cat.label}
        </span>

        <p style={styles.description}>{descripcion}</p>

        {/* Dirección */}
        {direccion && (
          <div style={styles.addressRow}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={styles.address}>{direccion}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  imageWrapper: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    backgroundColor: "#e8eef5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    backgroundColor: "#dce8f5",
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1a4a8a",
    lineHeight: 1.3,
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  description: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#555",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  addressRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "5px",
    marginTop: "4px",
  },
  address: {
    fontSize: "0.8rem",
    color: "#666",
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "220px",
  },
};