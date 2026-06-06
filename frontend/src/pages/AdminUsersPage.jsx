import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import SearchBar from "../components/SearchBar";
import { getAdminUsers } from "../api/adminApi";

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar los usuarios registrados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.name || "";
      const email = user.email || "";

      return (
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        email.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [users, searchText]);

  function formatDate(value) {
    if (!value) {
      return "Sin fecha";
    }

    return new Date(value).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {row.pictureUrl ? (
            <img
              src={row.pictureUrl}
              alt={row.name || "Usuario"}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#0f172a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700"
              }}
            >
              {(row.name || row.email || "U").charAt(0).toUpperCase()}
            </div>
          )}

          <strong>{row.name || "Usuario sin nombre"}</strong>
        </div>
      )
    },
    {
      key: "email",
      label: "Correo",
      render: (row) => row.email || "Sin correo"
    },
    {
      key: "role",
      label: "Rol",
      render: (row) => <span className="admin-badge">{row.role || "CLIENT"}</span>
    },
    {
      key: "active",
      label: "Estado",
      render: (row) => (
        <span className={row.active ? "status-active" : "status-inactive"}>
          {row.active ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Fecha de registro",
      render: (row) => formatDate(row.createdAt)
    }
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1>Gestión de usuarios</h1>
          <p>Consulta los usuarios registrados realmente en la base de datos.</p>
        </div>

        <button className="btn-admin-primary" onClick={loadUsers}>
          Actualizar
        </button>
      </div>

      <div className="admin-filter-row" style={{ gridTemplateColumns: "1fr 220px" }}>
        <SearchBar value={searchText} onChange={setSearchText} placeholder="Buscar por nombre o correo..." />

        <div className="admin-mini-stat">
          <span>Total de usuarios</span>
          <strong>{filteredUsers.length} usuarios</strong>
        </div>
      </div>

      {loading && (
        <div className="admin-card">
          <p>Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="admin-card">
          <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <AdminTable
          columns={columns}
          data={filteredUsers}
          renderActions={(row) => (
            <div className="admin-actions">
              <button onClick={() => alert(`Usuario: ${row.name || row.email}`)}>Ver</button>
            </div>
          )}
        />
      )}
    </AdminLayout>
  );
}