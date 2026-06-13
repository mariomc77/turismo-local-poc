import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  createAdminPlace,
  deleteAdminPlace,
  getAdminPlaces,
  getAdminTowns,
  updateAdminPlace
} from "../api/adminApi";

const emptyPlace = {
  id: null,
  townSlug: "playas-del-coco",
  townName: "Playas del Coco",
  name: "",
  category: "PLAYA",
  address: "",
  active: true,
  description: "",
  imageUrl: ""
};

const categoryOptions = [
  { value: "PLAYA", label: "Playa" },
  { value: "MIRADOR", label: "Mirador" },
  { value: "GASTRONOMIA", label: "Gastronomía" },
  { value: "PASEOS", label: "Paseos" },
  { value: "CULTURA", label: "Cultura" },
  { value: "RESTAURANTE", label: "Restaurante" },
  { value: "OTRO", label: "Otro" }
];

const categoryFilterOptions = [
  "Todos",
  "Playa",
  "Mirador",
  "Gastronomía",
  "Paseos",
  "Cultura",
  "Restaurante",
  "Otro"
];

const townCoordinates = {
  "playas-del-coco": { latitude: 10.5508, longitude: -85.6976 },
  tamarindo: { latitude: 10.2993, longitude: -85.8371 },
  samara: { latitude: 9.8819, longitude: -85.5287 },
  paquera: { latitude: 9.8205, longitude: -84.9356 },
  brasilito: { latitude: 10.4079, longitude: -85.7982 },
  "la-fortuna": { latitude: 10.4714, longitude: -84.6453 },
  "puerto-viejo": { latitude: 9.6561, longitude: -82.7545 },
  monteverde: { latitude: 10.3167, longitude: -84.8167 }
};

function getAutomaticCoordinates(townSlug) {
  return townCoordinates[townSlug] || townCoordinates["playas-del-coco"];
}

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState([]);
  const [towns, setTowns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTown, setSelectedTown] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyPlace);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80";

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [placesData, townsData] = await Promise.all([
        getAdminPlaces(),
        getAdminTowns()
      ]);

      setPlaces(Array.isArray(placesData) ? placesData : []);
      setTowns(Array.isArray(townsData) ? townsData : []);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const found = categoryOptions.find(
      (category) => category.value === categoryValue
    );

    return found ? found.label : categoryValue || "Sin categoría";
  };

  const getCategoryValueByLabel = (label) => {
    if (label === "Todos") {
      return "Todos";
    }

    const found = categoryOptions.find((category) => category.label === label);

    return found ? found.value : label;
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const name = place.name || "";
      const townName = place.townName || "";
      const category = place.category || "";
      const address = place.address || "";
      const description = place.description || "";

      const searchableText =
        `${name} ${townName} ${category} ${address} ${description}`.toLowerCase();

      const matchesSearch = searchableText.includes(searchText.toLowerCase());

      const matchesTown =
        selectedTown === "Todos" ||
        place.townSlug === selectedTown ||
        place.townName === selectedTown;

      const selectedCategoryValue = getCategoryValueByLabel(selectedCategory);

      const matchesCategory =
        selectedCategoryValue === "Todos" || category === selectedCategoryValue;

      return matchesSearch && matchesTown && matchesCategory;
    });
  }, [places, searchText, selectedTown, selectedCategory]);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(emptyPlace);
  };

  const handleNew = () => {
    const firstTown = towns[0];

    setFormData({
      ...emptyPlace,
      townSlug: firstTown?.slug || "playas-del-coco",
      townName: firstTown?.name || "Playas del Coco"
    });

    setFormOpen(true);
  };

  const handleEdit = (place) => {
    setFormData({
      id: place.id,
      townSlug: place.townSlug || "",
      townName: place.townName || "",
      name: place.name || "",
      category: place.category || "PLAYA",
      address: place.address || "",
      active: place.active !== false,
      description: place.description || "",
      imageUrl: place.imageUrl || ""
    });

    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este lugar?");

    if (!confirmDelete) {
      return;
    }

    await deleteAdminPlace(id);

    setPlaces((current) => current.filter((place) => place.id !== id));

    if (formData?.id === id) {
      closeForm();
    }

    alert("Lugar eliminado correctamente");
  };

  const buildPayload = () => {
    const selectedTownData = towns.find(
      (town) => town.slug === formData.townSlug
    );

    const automaticCoordinates = getAutomaticCoordinates(formData.townSlug);

    return {
      townId: selectedTownData?.id || null,
      townSlug: formData.townSlug,
      name: formData.name.trim(),
      description: formData.description,
      category: formData.category,
      address: formData.address,
      imageUrl: formData.imageUrl,
      latitude: automaticCoordinates.latitude,
      longitude: automaticCoordinates.longitude,
      active: formData.active
    };
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("El nombre del lugar es obligatorio");
      return;
    }

    if (!formData.category) {
      alert("La categoría es obligatoria");
      return;
    }

    if (!formData.townSlug) {
      alert("Debe seleccionar un pueblo");
      return;
    }

    const payload = buildPayload();

    if (formData.id) {
      const updatedPlace = await updateAdminPlace(formData.id, payload);

      setPlaces((current) =>
        current.map((place) =>
          place.id === updatedPlace.id ? updatedPlace : place
        )
      );

      alert("Lugar actualizado correctamente");
      closeForm();
      return;
    }

    const createdPlace = await createAdminPlace(payload);

    setPlaces((current) => [createdPlace, ...current]);

    alert("Lugar agregado correctamente");
    closeForm();
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Cargando lugares turísticos..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Gestión de lugares turísticos</h1>
            <p>
              Administra los puntos de interés, actividades y servicios de cada
              pueblo.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleNew}
            >
              + Agregar lugar
            </button>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-place-filters">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              placeholder="Nombre, dirección o descripción"
              label="Buscar lugar"
            />

            <label>
              Filtrar por pueblo
              <select
                value={selectedTown}
                onChange={(event) => setSelectedTown(event.target.value)}
              >
                <option value="Todos">Todos</option>

                {towns.map((town) => (
                  <option key={town.id} value={town.slug}>
                    {town.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Categoría
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categoryFilterOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <CategoryFilter
            categories={categoryFilterOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="places-admin-table">
            <div className="places-admin-head">
              <span>Imagen</span>
              <span>Nombre</span>
              <span>Pueblo</span>
              <span>Categoría</span>
              <span>Dirección</span>
              <span>Acciones</span>
            </div>

            {filteredPlaces.map((place) => (
              <div className="places-admin-row" key={place.id}>
                <img
                  src={place.imageUrl || fallbackImage}
                  alt={place.name}
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />

                <strong>{place.name}</strong>
                <span>{place.townName || "Sin pueblo"}</span>
                <span>{getCategoryLabel(place.category)}</span>
                <span>{place.address || "Sin dirección"}</span>

                <div className="admin-actions">
                  <button type="button" onClick={() => handleEdit(place)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(place.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {filteredPlaces.length === 0 && (
              <div className="admin-empty-state">
                <h3>No hay lugares registrados</h3>
                <p>Puedes agregar un lugar nuevo con el botón superior.</p>
              </div>
            )}
          </div>

          <p className="admin-table-summary">
            Mostrando {filteredPlaces.length} de {places.length} lugares
            registrados.
          </p>
        </div>

        {formOpen && (
          <div className="admin-modal-backdrop">
            <div
              className="admin-modal admin-modal-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="place-modal-title"
            >
              <div className="admin-modal-header">
                <div>
                  <h2 id="place-modal-title">
                    {formData.id
                      ? "Editar Lugar Turístico"
                      : "Agregar Lugar Turístico"}
                  </h2>
                  <p>
                    Completa los campos para guardar la información del lugar.
                  </p>
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

              <form
                className="admin-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <label>
                  Nombre del lugar
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                  />
                </label>

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
                    Categoría
                    <select
                      value={formData.category}
                      onChange={(event) =>
                        handleChange("category", event.target.value)
                      }
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Pueblo
                    <select
                      value={formData.townSlug}
                      onChange={(event) =>
                        handleChange("townSlug", event.target.value)
                      }
                    >
                      {towns.map((town) => (
                        <option key={town.id} value={town.slug}>
                          {town.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Dirección exacta
                  <textarea
                    value={formData.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
                  />
                </label>

                <label>
                  URL de la imagen
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) =>
                      handleChange("imageUrl", event.target.value)
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </label>

                <div className="active-box">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) =>
                      handleChange("active", event.target.checked)
                    }
                    aria-label="Estado activo"
                  />

                  <div>
                    <strong>Estado activo</strong>
                    <p>
                      Habilita o deshabilita la visibilidad de este lugar para
                      los turistas. Las coordenadas del mapa se asignan
                      automáticamente según el pueblo.
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
                    Guardar Cambios
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