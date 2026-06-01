import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlacesByTownSlug } from "../api/placeApi";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function PlacesPage() {
  const { townSlug } = useParams();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPlacesByTownSlug(townSlug);
        setPlaces(data);
      } catch {
        setError("No se pudieron cargar los lugares turísticos.");
        navigate("/error?reason=not-found");
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, [townSlug, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <Navbar />

      <main className="container py-4">
        <h1 className="mb-4">Lugares turísticos</h1>

        {places.length === 0 ? (
          <div className="alert alert-info">
            No hay lugares turísticos registrados para este pueblo.
          </div>
        ) : (
          <div className="row g-4">
            {places.map((place) => (
              <div className="col-12 col-md-6 col-lg-4" key={place.id}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}