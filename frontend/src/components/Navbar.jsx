import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/p/playas-del-coco" style={styles.brand}>
        Turismo Local UNA
      </Link>
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
    textDecoration: "none",
  },
};