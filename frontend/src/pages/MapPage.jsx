import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIProvider, InfoWindow, Map, Marker } from "@vis.gl/react-google-maps";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPlacesByTownSlug } from "../api/placeApi";
import { getTownBySlug } from "../api/townApi";

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

const townDefaultCenters = {
  "playas-del-coco": {
    lat: 10.5508,
    lng: -85.6976
  },
  tamarindo: {
    lat: 10.2993,
    lng: -85.8371
  },
  paquera: {
    lat: 9.8205,
    lng: -84.9356
  },
  brasilito: {
    lat: 10.4079,
    lng: -85.7982
  },
  "la-fortuna": {
    lat: 10.4714,
    lng: -84.6453
  },
  "puerto-viejo": {
    lat: 9.6561,
    lng: -82.7545
  },
  monteverde: {
    lat: 10.3167,
    lng: -84.8167
  }
};

export default function MapPage() {
  const { townSlug } = useParams();

  const [town, setTown] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const slug = townSlug || "playas-del-coco";
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    loadMapData();
  }, [slug]);

  const loadMapData = async () => {
    try {
      setLoading(true);

      const [townData, placesData] = await Promise.all([
        getTownBySlug(slug),
        getPlacesByTownSlug(slug)
      ]);

      setTown(townData);
      setPlaces(Array.isArray(placesData) ? placesData : []);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const found = categoryOptions.find((category) => category.value === categoryValue);
    return found ? found.label : categoryValue || "Sin categoría";
  };

  const getCategoryValueByLabel = (label) => {
    if (label === "Todos") return "Todos";

    const found = categoryOptions.find((category) => category.label === label);
    return found ? found.value : label;
  };

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const selectedCategoryValue = getCategoryValueByLabel(selectedCategory);

    return places.filter((place) => {
      const name = place.name || "";
      const category = place.category || "";
      const categoryLabel = getCategoryLabel(category);
      const address = place.address || "";
      const description = place.description || "";

      const searchableText = `${name} ${category} ${categoryLabel} ${address} ${description}`.toLowerCase();

      const matchesSearch =
        normalizedSearch === "" || searchableText.includes(normalizedSearch);

      const matchesCategory =
        selectedCategoryValue === "Todos" || category === selectedCategoryValue;

      return matchesSearch && matchesCategory;
    });
  }, [places, searchText, selectedCategory]);

  const placesWithCoordinates = useMemo(() => {
    return filteredPlaces.filter((place) => {
      return (
        place.latitude !== null &&
        place.latitude !== undefined &&
        place.longitude !== null &&
        place.longitude !== undefined
      );
    });
  }, [filteredPlaces]);

  const defaultCenter = useMemo(() => {
    if (placesWithCoordinates.length > 0) {
      const lat =
        placesWithCoordinates.reduce((sum, place) => sum + Number(place.latitude), 0) /
        placesWithCoordinates.length;

      const lng =
        placesWithCoordinates.reduce((sum, place) => sum + Number(place.longitude), 0) /
        placesWithCoordinates.length;

      return { lat, lng };
    }

    return townDefaultCenters[slug] || townDefaultCenters["playas-del-coco"];
  }, [placesWithCoordinates, slug]);

  const openGoogleMaps = (place) => {
    const query = encodeURIComponent(`${place.name || ""} ${place.address || ""}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const getImage = (place) => {
    return (
      place.imageUrl ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80"
    );
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedCategory("Todos");
    setSelectedPlace(null);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar townSlug={slug} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar townSlug={slug} />

        <div className="container py-5">
          <div className="alert alert-warning rounded-4 shadow-sm">
            <h4 className="fw-bold">Falta configurar Google Maps</h4>
            <p className="mb-2">
              Agrega la API Key en el archivo <strong>frontend/.env</strong>.
            </p>
            <pre className="mb-0">VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY</pre>
          </div>
        </div>
      </div>
    );
  }

  const townName = town?.name || "Playas del Coco";

  return (
    <div className="map-page">
      <Navbar townSlug={slug} />

      <div className="map-layout">
        <aside className="map-sidebar">
          <h2>Explorar {townName}</h2>

          <div className="map-search">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Buscar lugares..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div className="map-categories">
            {categoryFilterOptions.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="map-place-list">
            {filteredPlaces.map((place, index) => (
              <button
                type="button"
                className="map-place-card"
                key={place.id}
                onClick={() => setSelectedPlace(place)}
              >
                <img src={getImage(place)} alt={place.name} />

                <div>
                  <small>#{index + 1}</small>
                  <h4>{place.name}</h4>
                  <p>{getCategoryLabel(place.category)} · ⭐ 4.8</p>
                  <span>📍 {place.address || "Ubicación referencial"}</span>
                </div>
              </button>
            ))}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="map-selected-card">
              <h4>No encontramos lugares</h4>
              <p>Intenta buscar otra palabra o cambiar el filtro.</p>

              <button type="button" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}

          {selectedPlace && (
            <div className="map-selected-card">
              <h4>{selectedPlace.name}</h4>
              <p>{selectedPlace.description || "Sin descripción disponible."}</p>

              <button type="button" onClick={() => openGoogleMaps(selectedPlace)}>
                Abrir en Google Maps
              </button>
            </div>
          )}

          <div className="mt-4">
            <Link to={`/places/${slug}`} className="btn btn-info text-white rounded-pill w-100">
              Volver a lugares
            </Link>
          </div>
        </aside>

        <main className="real-map-container">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={true}
              fullscreenControl={true}
              style={{ width: "100%", height: "100%" }}
            >
              {placesWithCoordinates.map((place) => (
                <Marker
                  key={place.id}
                  position={{
                    lat: Number(place.latitude),
                    lng: Number(place.longitude)
                  }}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}

              {selectedPlace &&
                selectedPlace.latitude !== null &&
                selectedPlace.latitude !== undefined &&
                selectedPlace.longitude !== null &&
                selectedPlace.longitude !== undefined && (
                  <InfoWindow
                    position={{
                      lat: Number(selectedPlace.latitude),
                      lng: Number(selectedPlace.longitude)
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div style={{ maxWidth: 250 }}>
                      <img
                        src={getImage(selectedPlace)}
                        alt={selectedPlace.name}
                        style={{
                          width: "100%",
                          height: 115,
                          objectFit: "cover",
                          borderRadius: 12,
                          marginBottom: 10
                        }}
                      />

                      <h6 style={{ fontWeight: 800, marginBottom: 6 }}>
                        {selectedPlace.name}
                      </h6>

                      <p style={{ fontSize: 13, marginBottom: 8 }}>
                        {selectedPlace.description || "Sin descripción disponible."}
                      </p>

                      <p style={{ fontSize: 12, marginBottom: 10 }}>
                        📍 {selectedPlace.address || "Ubicación referencial"}
                      </p>

                      <button
                        type="button"
                        onClick={() => openGoogleMaps(selectedPlace)}
                        style={{
                          border: "none",
                          background: "#38bdf8",
                          color: "white",
                          borderRadius: 999,
                          padding: "8px 14px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Abrir ruta
                      </button>
                    </div>
                  </InfoWindow>
                )}
            </Map>
          </APIProvider>
        </main>
      </div>

      <footer className="map-footer">
        <span>© 2026 Turismo Local POC</span>
        <span>Servicio en línea · {townName}</span>
      </footer>
    </div>
  );
}