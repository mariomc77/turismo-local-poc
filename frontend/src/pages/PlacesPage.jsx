import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPlacesByTownSlug } from "../api/placeApi";
import { getTownBySlug } from "../api/townApi";

export default function PlacesPage() {
  const { townSlug } = useParams();

  const [town, setTown] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const slug = townSlug || "playas-del-coco";

  const categories = ["Todos", "Playa", "Restaurante", "Mirador", "Actividad", "Hotel"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const townData = await getTownBySlug(slug);
        const placesData = await getPlacesByTownSlug(slug);

        setTown(townData);
        setPlaces(Array.isArray(placesData) ? placesData : []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return places.filter((place) => {
      const name = place.name || "";
      const category = place.category || "";
      const address = place.address || "";
      const description = place.description || "";

      const searchableText = `${name} ${category} ${address} ${description}`.toLowerCase();

      const matchesSearch =
        normalizedSearch === "" || searchableText.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "Todos" ||
        category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [places, searchText, selectedCategory]);

  const closeModal = () => {
    setSelectedPlace(null);
  };

  if (loading) {
    return (
      <>
        <Navbar townSlug={slug} />
        <LoadingSpinner />
      </>
    );
  }

  const townName = town?.name || "Playas del Coco";

  return (
    <div className="min-vh-100 bg-white">
      <Navbar townSlug={slug} />

      <main className="container py-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-2">
              Lugares turísticos en <span className="text-info">{townName}</span>
            </h1>

            <p className="text-muted mb-0" style={{ maxWidth: 660 }}>
              Descubre la magia de Guanacaste. Desde playas cristalinas hasta gastronomía local, encuentra tu próximo destino favorito aquí.
            </p>
          </div>

          <div className="align-self-start">
            <span className="badge bg-light text-muted border rounded-pill px-4 py-3">
              📍 Guanacaste, Costa Rica
            </span>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  🔎
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por nombre, categoría o dirección..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />

                {searchText && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchText("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                <span className="small text-muted align-self-center me-2">
                  Filtrar:
                </span>

                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      selectedCategory === category
                        ? "btn-info text-white"
                        : "btn-light border"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="small text-muted mb-4">
          Mostrando {filteredPlaces.length} lugares encontrados
        </p>

        <div className="row g-4">
          {filteredPlaces.map((place) => (
            <div className="col-md-6 col-xl-4" key={place.id || place.name}>
              <PlaceCard place={place} onViewDetails={setSelectedPlace} />
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-5">
            <h3 className="fw-bold">No encontramos lugares</h3>
            <p className="text-muted">
              Intenta escribir otro nombre, dirección, categoría o descripción.
            </p>

            <button
              type="button"
              className="btn btn-info text-white rounded-pill px-4"
              onClick={() => {
                setSearchText("");
                setSelectedCategory("Todos");
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        <section
          className="mt-5 rounded-5 p-5"
          style={{ background: "linear-gradient(90deg, #dff7ff, #e8fff0)" }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark rounded-pill mb-3">
                Para visitar primero
              </span>

              <h2 className="fw-bold mb-3">
                ¿No sabes por dónde empezar?
              </h2>

              <p className="text-muted mb-4">
                Nuestra guía interactiva en el mapa te permite ver qué lugares están más cerca de tu ubicación actual.
              </p>

              <div className="d-flex flex-column flex-md-row gap-3">
                <Link to={`/map/${slug}`} className="btn btn-info text-white rounded-pill px-4 fw-bold">
                  Abrir mapa interactivo
                </Link>

                <Link to={`/qr/${slug}`} className="btn btn-outline-info rounded-pill px-4 fw-bold">
                  Generar mi código QR
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
                  alt="Eco Tour"
                  className="img-fluid rounded-4 shadow"
                  style={{ maxHeight: 230, objectFit: "cover" }}
                />

                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white shadow rounded-4 p-3 text-start">
                  <span className="badge bg-success mb-1">Popular ahora</span>
                  <div className="fw-bold">Eco-Tours</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedPlace && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(15, 23, 42, 0.65)"
          }}
          tabIndex="-1"
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-5 overflow-hidden shadow-lg">
              <div className="position-relative">
                <img
                  src={
                    selectedPlace.imageUrl ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={selectedPlace.name}
                  className="w-100"
                  style={{ height: 330, objectFit: "cover" }}
                />

                <button
                  type="button"
                  className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                  style={{ width: 44, height: 44 }}
                  onClick={closeModal}
                >
                  ×
                </button>

                <span className="badge bg-info position-absolute bottom-0 start-0 m-4 rounded-pill px-4 py-2">
                  {selectedPlace.category || "Turismo"}
                </span>

                <span className="badge bg-warning text-dark position-absolute bottom-0 end-0 m-4 rounded-pill px-4 py-2">
                  ★ 4.8
                </span>
              </div>

              <div className="modal-body p-5">
                <h2 className="fw-bold mb-3">
                  {selectedPlace.name}
                </h2>

                <p className="text-muted mb-4">
                  {selectedPlace.description || "No hay descripción disponible para este lugar."}
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="bg-light rounded-4 p-4 h-100">
                      <h6 className="fw-bold mb-2">Dirección</h6>
                      <p className="text-muted mb-0">
                        📍 {selectedPlace.address || "Ubicación no disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded-4 p-4 h-100">
                      <h6 className="fw-bold mb-2">Categoría</h6>
                      <p className="text-muted mb-0">
                        🏷 {selectedPlace.category || "Turismo"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedPlace.name || ""} ${selectedPlace.address || ""}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info text-white rounded-pill px-4 fw-bold"
                  >
                    Abrir en Google Maps
                  </a>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    onClick={closeModal}
                  >
                    Cerrar detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-4 bg-white border-top text-center text-muted small">
        © 2026 Turismo Local POC. Costa Rica.
      </footer>
    </div>
  );
}