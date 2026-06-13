import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  createAdminTown,
  deleteAdminTown,
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
      const matchesStatus =
        statusFilter === "Todos" || currentStatus === statusFilter;

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

  const closeForm = () => {
    setFormOpen(false);
    setFormData(emptyTown);
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
      active: town.active !== false
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
      slug: formData.slug.trim()
        ? normalizeSlug(formData.slug)
        : normalizeSlug(formData.name),
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
      closeForm();
      return;
    }

    const createdTown = await createAdminTown(payload);

    setTowns((current) => [createdTown, ...current]);

    alert("Pueblo creado correctamente");
    closeForm();
  };

  const handleToggleStatus = async (id) => {
    const updatedTown = await toggleAdminTownActive(id);

    setTowns((current) =>
      current.map((town) => (town.id === updatedTown.id ? updatedTown : town))
    );
  };

  const handleDelete = async (town) => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar el pueblo ${town.name}? También podrían eliminarse sus lugares asociados.`
    );

    if (!confirmDelete) {
      return;
    }

    await deleteAdminTown(town.id);

    setTowns((current) => current.filter((item) => item.id !== town.id));

    if (formData.id === town.id) {
      closeForm();
    }

    alert("Pueblo eliminado correctamente");
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
      label: "Nombre",
      render: (row) => (
        <div>
          <strong>{row.name}</strong>
          <p className="admin-table-description">
            {row.description || "Sin descripción"}
          </p>
        </div>
      )
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => `/p/${row.slug}`
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
      key: "province",
      label: "Provincia",
      render: (row) => row.province || "Sin provincia"
    },
    {
      key: "updatedAt",
      label: "Última modificación",
      render: (row) => formatDate(row.updatedAt)
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Cargando pueblos..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Gestión de pueblos</h1>
            <p>
              Administra los destinos turísticos principales disponibles en la
              plataforma.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleNew}
            >
              + Agregar pueblo
            </button>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-filter-row">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              placeholder="Buscar pueblo"
              label="Buscar pueblo"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <div className="admin-mini-stat">
              <span>Total de pueblos</span>
              <strong>{filteredTowns.length}</strong>
              <small>Destinos</small>
            </div>
          </div>

          <AdminTable
            columns={columns}
            data={filteredTowns}
            renderActions={(row) => (
              <div className="admin-actions">
                <button
                  type="button"
                  onClick={() => window.open(`/p/${row.slug}`, "_blank")}
                >
                  Ver
                </button>

                <button type="button" onClick={() => handleEdit(row)}>
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(row.id)}
                >
                  {row.active ? "Desactivar" : "Activar"}
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDelete(row)}
                >
                  Eliminar
                </button>
              </div>
            )}
          />
        </div>

        {formOpen && (
          <div className="admin-modal-backdrop" onClick={closeForm}>
            <div
              className="admin-modal admin-modal-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <div>
                  <h2>{formData.id ? "Editar pueblo" : "Agregar pueblo"}</h2>
                  <p>Completa los datos básicos del destino turístico.</p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={closeForm}
                  aria-label="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
                <div className="admin-form-grid">
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Slug
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(event) =>
                        handleChange("slug", event.target.value)
                      }
                      placeholder="playas-del-coco"
                    />
                  </label>
                </div>

                <label>
                  Descripción
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                  />
                </label>

                <div className="admin-form-grid">
                  <label>
                    Provincia
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(event) =>
                        handleChange("province", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    País
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(event) =>
                        handleChange("country", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="active-box">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) =>
                      handleChange("active", event.target.checked)
                    }
                  />

                  <div>
                    <strong>Estado activo</strong>
                    <p>
                      Permite que el pueblo aparezca públicamente para los
                      turistas.
                    </p>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={closeForm}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={handleSave}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}