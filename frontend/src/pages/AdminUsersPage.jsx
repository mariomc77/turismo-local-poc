import { useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import SearchBar from "../components/SearchBar";

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState("");

  const users = [
    { id: 1, name: "Mario Jose Mendez Chaves", email: "mario@gmail.com", role: "ADMIN", status: "Activo", date: "2026-06-02" },
    { id: 2, name: "Carlos Brenes", email: "carlos@gmail.com", role: "USER", status: "Activo", date: "2026-06-01" },
    { id: 3, name: "Maria Rodriguez", email: "maria@gmail.com", role: "USER", status: "Activo", date: "2026-05-30" }
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [searchText]);

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo" },
    { key: "role", label: "Rol", render: (row) => <span className="admin-badge">{row.role}</span> },
    { key: "status", label: "Estado", render: (row) => <span className="status-active">{row.status}</span> },
    { key: "date", label: "Fecha de registro" }
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1>Gestión de usuarios</h1>
          <p>Consulta los usuarios registrados en la plataforma turística.</p>
        </div>

        <button className="btn-admin-primary" onClick={() => alert("Función visual: creación de usuario")}>
          + Nuevo usuario
        </button>
      </div>

      <div className="admin-filter-row" style={{ gridTemplateColumns: "1fr 220px" }}>
        <SearchBar value={searchText} onChange={setSearchText} placeholder="Buscar por nombre o correo..." />

        <div className="admin-mini-stat">
          <span>Total de usuarios</span>
          <strong>{filteredUsers.length} usuarios</strong>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredUsers}
        renderActions={() => (
          <div className="admin-actions">
            <button onClick={() => alert("Vista de usuario")}>Ver</button>
            <button onClick={() => alert("Edición visual de usuario")}>Editar</button>
            <button className="danger" onClick={() => alert("Usuario desactivado visualmente")}>Desactivar</button>
          </div>
        )}
      />
    </AdminLayout>
  );
}