import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAdminUsers,
  toggleAdminUserActive,
  updateAdminUserRole
} from "../api/adminApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.name || "";
      const email = user.email || "";
      const role = user.role || "";
      const matchesSearch =
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        email.toLowerCase().includes(searchText.toLowerCase());

      const matchesRole = roleFilter === "Todos" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchText, roleFilter]);

  const handleRoleChange = async (id, role) => {
    const confirmChange = window.confirm(`¿Deseas cambiar el rol del usuario a ${role}?`);

    if (!confirmChange) {
      return;
    }

    const updatedUser = await updateAdminUserRole(id, role);

    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    alert("Rol actualizado correctamente");
  };

  const handleToggleActive = async (user) => {
    const action = user.active ? "desactivar" : "activar";
    const confirmChange = window.confirm(`¿Deseas ${action} este usuario?`);

    if (!confirmChange) {
      return;
    }

    const updatedUser = await toggleAdminUserActive(user.id);

    setUsers((current) =>
      current.map((item) => (item.id === updatedUser.id ? updatedUser : item))
    );

    alert("Estado del usuario actualizado correctamente");
  };

  const formatDate = (date) => {
    if (!date) {
      return "Sin fecha";
    }

    return new Date(date).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const columns = [
    {
      key: "name",
      label: "Usuario",
      render: (row) => (
        <div className="d-flex align-items-center gap-3">
          {row.pictureUrl ? (
            <img
              src={row.pictureUrl}
              alt={row.name}
              width="42"
              height="42"
              className="rounded-circle"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="admin-avatar">
              {(row.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <strong>{row.name || "Sin nombre"}</strong>
            <div className="text-muted small">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Rol",
      render: (row) => (
        <select
          className="form-select form-select-sm"
          value={row.role || "CLIENT"}
          onChange={(event) => handleRoleChange(row.id, event.target.value)}
        >
          <option value="CLIENT">CLIENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      )
    },
    {
      key: "active",
      label: "Estado",
      render: (row) => (
        <span className={`badge rounded-pill ${row.active ? "bg-success" : "bg-secondary"}`}>
          {row.active ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Registro",
      render: (row) => formatDate(row.createdAt)
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Cargando usuarios registrados..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <h1>Gestión de usuarios</h1>
            <p>Consulta usuarios reales registrados y administra sus roles dentro del sistema.</p>
          </div>
        </div>

        <div className="admin-toolbar">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar usuario por nombre o correo"
          />

          <select
            className="form-select"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="Todos">Todos los roles</option>
            <option value="CLIENT">CLIENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span>Total de usuarios</span>
            <strong>{users.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Usuarios visibles</span>
            <strong>{filteredUsers.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Administradores</span>
            <strong>{users.filter((user) => user.role === "ADMIN").length}</strong>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={filteredUsers}
          renderActions={(row) => (
            <div className="admin-actions">
              <button type="button" onClick={() => handleToggleActive(row)}>
                {row.active ? "Desactivar" : "Activar"}
              </button>
            </div>
          )}
        />

        {filteredUsers.length === 0 && (
          <div className="admin-empty">
            <h3>No hay usuarios registrados</h3>
            <p>Los usuarios aparecerán cuando inicien sesión con Google.</p>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}