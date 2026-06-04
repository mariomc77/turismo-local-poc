import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  createAdminTown,
  getAdminTowns,
  toggleAdminTownActive,
  updateAdminTown
} from "../api/adminApi";

const emptyTown = {
  id: null,
  name: "",
  slug: "",
  description: "",
  province: "Guanacaste",
  country: "Costa Rica",
  active: true
};

export default function AdminTownsPage() {
  const [towns, setTowns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyTown);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80";

  useEffect(() => {
    loadTowns();
  }, []);

  const loadTowns = async () => {
    try {
      setLoading(true);
      const data = await getAdminTowns();
      setTowns(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const filteredTowns = useMemo(() => {
    return towns.filter((town) => {
      const name = town.name || "";
      const slug = town.slug || "";

      const matchesSearch =
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        slug.toLowerCase().includes(searchText.toLowerCase());

      const currentStatus = town.active ? "Activo" : "Inactivo";
      const matchesStatus = statusFilter === "Todos" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [towns, searchText, statusFilter]);

  const normalizeSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replaceAll("á", "a")
      .replaceAll("é", "e")
      .replaceAll("í", "i")
      .replaceAll("ó", "o")
      .replaceAll("ú", "u")
      .replaceAll("ñ", "n")
      .replaceAll("/p/", "")
      .replaceAll(" ", "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  const handleNew = () => {
    setFormData(emptyTown);
    setFormOpen(true);
  };

  const handleEdit = (town) => {
    setFormData({
      id: town.id,
      name: town.name || "",
      slug: town.slug || "",
      description: town.description || "",
      province: town.province || "Guanacaste",
      country: town.country || "Costa Rica",
      active: Boolean(town.active)
    });

    setFormOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("El nombre del pueblo es obligatorio");
      return;
    }

    const payload = {
      slug: formData.slug.trim() ? normalizeSlug(formData.slug) : normalizeSlug(formData.name),
      name: formData.name.trim(),
      description: formData.description,
      province: formData.province,
      country: formData.country,
      active: formData.active
    };

    if (formData.id) {
      const updatedTown = await updateAdminTown(formData.id, payload);

      setTowns((current) =>
        current.map((town) => (town.id === updatedTown.id ? updatedTown : town))
      );

      alert("Pueblo actualizado correctamente");
      setFormOpen(false);
      return;
    }

    const createdTown = await createAdminTown(payload);
    setTowns((current) => [createdTown, ...current]);
    setFormData(createdTown);
    alert("Pueblo creado correctamente");
    setFormOpen(false);
  };

  const handleToggleStatus = async (id) => {
    const updatedTown = await toggleAdminTownActive(id);

    setTowns((current) =>
      current.map((town) => (town.id === updatedTown.id ? updatedTown : town))
    );
  };

  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (row) => (
        <div className="admin-name-cell">
          <img src={fallbackImage} alt={row.name} />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => <span className="slug-pill">/p/{row.slug}</span>
    },
    {
      key: "active",
      label: "Estado",
      render: (row) => (
        <span className={row.active ? "status-active" : "status-inactive"}>
          ● {row.active ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "province",
      label: "Provincia",
      render: (row) => row.province || "Sin provincia"
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1>Gestión de pueblos</h1>
          <p>Administra los destinos turísticos principales disponibles en la plataforma.</p>
        </div>

        <button className="btn-admin-success" onClick={handleNew}>
          + Agregar pueblo
        </button>
      </div>

      <div className="admin-filter-row">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Buscar por nombre o slug..."
        />

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option>Todos</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>

        <div className="admin-mini-stat">
          <span>Total de pueblos</span>
          <strong>{filteredTowns.length} Destinos</strong>
        </div>
      </div>

      {formOpen && (
        <section className="admin-panel mb-4">
          <div className="admin-panel-header">
            <div>
              <h2>{formData.id ? "Editar pueblo" : "Agregar pueblo"}</h2>
              <p>Completa los datos básicos del destino turístico.</p>
            </div>

            <button className="btn-admin-light" onClick={() => setFormOpen(false)}>
              Cerrar
            </button>
          </div>

          <div className="admin-form">
            <div className="admin-form-grid">
              <label>
                Nombre
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
              </label>

              <label>
                Slug
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  placeholder="playas-del-coco"
                />
              </label>
            </div>

            <label>
              Descripción
              <textarea
                value={formData.description}
                onChange={(event) => handleChange("description", event.target.value)}
              />
            </label>

            <div className="admin-form-grid">
              <label>
                Provincia
                <input
                  type="text"
                  value={formData.province}
                  onChange={(event) => handleChange("province", event.target.value)}
                />
              </label>

              <label>
                País
                <input
                  type="text"
                  value={formData.country}
                  onChange={(event) => handleChange("country", event.target.value)}
                />
              </label>
            </div>

            <div className="active-box">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(event) => handleChange("active", event.target.checked)}
              />

              <div>
                <strong>Estado activo</strong>
                <p>Permite que el pueblo aparezca públicamente para los turistas.</p>
              </div>
            </div>

            <div className="admin-form-actions">
              <button className="btn-admin-secondary" onClick={() => setFormOpen(false)}>
                Cancelar
              </button>

              <button className="btn-admin-primary" onClick={handleSave}>
                Guardar
              </button>
            </div>
          </div>
        </section>
      )}

      <AdminTable
        columns={columns}
        data={filteredTowns}
        renderActions={(row) => (
          <div className="admin-actions">
            <button onClick={() => window.open(`/p/${row.slug}`, "_blank")}>
              Ver
            </button>

            <button onClick={() => handleEdit(row)}>
              Editar
            </button>

            <button className="danger" onClick={() => handleToggleStatus(row.id)}>
              {row.active ? "Desactivar" : "Activar"}
            </button>
          </div>
        )}
      />
    </AdminLayout>
  );
}