import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "▦" },
    { label: "Pueblos", path: "/admin/towns", icon: "⌂" },
    { label: "Lugares", path: "/admin/places", icon: "⌖" },
    { label: "Usuarios", path: "/admin/users", icon: "♙" },
    { label: "Reportes", path: "/admin/reports", icon: "▥" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/p/playas-del-coco");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-logo">
          <span className="admin-logo-circle">☼</span>
          <span>Turismo Local POC</span>
        </div>

        <nav className="admin-menu">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar-bottom">
        <button className="admin-menu-item admin-menu-button">
          ⚙ Ajustes
        </button>

        <button className="admin-menu-item admin-menu-button danger" onClick={handleLogout}>
          ↪ Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}