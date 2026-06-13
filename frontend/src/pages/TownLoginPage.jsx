import { useEffect, useState } from "react"; import { Link, useParams } from "react-router-dom"; import Navbar from "../components/Navbar"; import GoogleLoginButton from "../components/GoogleLoginButton"; import LoadingSpinner from "../components/LoadingSpinner"; import { getTownBySlug } from "../api/townApi"; export default function TownLoginPage() { const { townSlug } = useParams(); const [town, setTown] = useState(null); const [loading, setLoading] = useState(true); const slug = townSlug || "playas-del-coco"; useEffect(() => { const loadTown = async () => { try { setLoading(true); const townData = await getTownBySlug(slug); setTown(townData); } finally { setLoading(false); } }; loadTown(); }, [slug]); if (loading) { return ( <>
<Navbar townSlug={slug} />
<LoadingSpinner />
</> ); } const townName = town?.name || "Playas del Coco"; const description = town?.description || "Tu puerta de entrada a descubrir increíbles lugares, gastronomía local y el encanto turístico de Costa Rica."; const heroImage = town?.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"; return ( <div className="min-vh-100 bg-white">
<Navbar townSlug={slug} />
<section className="position-relative d-flex align-items-center justify-content-center text-center text-white" style={{ minHeight: "650px", backgroundImage: `linear-gradient(rgba(0, 70, 100, 0.45), rgba(0, 0, 0, 0.35)), url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} >
<div className="container px-4">
<span className="badge bg-info rounded-pill px-4 py-2 mb-3"> Destino turístico local </span>
<h1 className="display-3 fw-bold mb-3"> Bienvenido a <span className="text-info">{townName}</span>
</h1>
<p className="lead mx-auto mb-4" style={{ maxWidth: 720 }}> {description} </p>
<div className="d-flex flex-column flex-md-row justify-content-center gap-3">
<div>
<GoogleLoginButton townSlug={slug} />
</div>
<Link className="btn btn-outline-light btn-lg rounded-pill px-5" to={`/map/${slug}`} > Ver mapa del pueblo </Link>
</div>
</div>
</section>
<section className="py-5 bg-white">
<div className="container">
<div className="text-center mb-5">
<h2 className="fw-bold">Todo lo que necesitas en un solo lugar</h2>
<p className="text-muted"> Encuentra guías, lugares recomendados y acceso rápido desde QR. </p>
</div>
<div className="row g-4">
<div className="col-md-4">
<div className="card border-0 shadow-sm rounded-4 h-100 p-4">
<div className="fs-2 mb-3 text-info"></div>
<h5 className="fw-bold">Explorar lugares recomendados</h5>
<p className="text-muted small mb-0"> Playas, restaurantes, miradores, hoteles y actividades en un solo catálogo. </p>
</div>
</div>
<div className="col-md-4">
<div className="card border-0 shadow-sm rounded-4 h-100 p-4">
<div className="fs-2 mb-3 text-success"></div>
<h5 className="fw-bold">Ver categorías turísticas</h5>
<p className="text-muted small mb-0"> Filtra fácilmente por tipo de destino y encuentra lo que quieres visitar. </p>
</div>
</div>
<div className="col-md-4">
<div className="card border-0 shadow-sm rounded-4 h-100 p-4">
<div className="fs-2 mb-3 text-warning"></div>
<h5 className="fw-bold">Acceso rápido desde código QR</h5>
<p className="text-muted small mb-0"> Ideal para hoteles, restaurantes y puntos de información turística. </p>
</div>
</div>
</div>
</div>
</section>
<section className="py-5" style={{ background: "linear-gradient(90deg, #e0f7ff, #f0fff4)" }} >
<div className="container">
<div className="row align-items-center g-5">
<div className="col-lg-6">
<div className="row g-3">
<div className="col-6">
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="Playa" className="img-fluid rounded-4 shadow-sm" />
</div>
<div className="col-6">
<img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80" alt="Naturaleza" className="img-fluid rounded-4 shadow-sm" />
</div>
<div className="col-8 mx-auto">
<img src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80" alt="Atardecer" className="img-fluid rounded-4 shadow-sm" />
</div>
</div>
</div>
<div className="col-lg-6">
<span className="badge bg-warning text-dark rounded-pill mb-3"> Vive la experiencia </span>
<h2 className="display-6 fw-bold mb-3"> Más que una playa, una experiencia completa </h2>
<p className="text-muted mb-4"> Explora playas, descubre gastronomía local, encuentra actividades y accede a información útil desde tu celular. </p>
<div className="row g-3 mb-4">
<div className="col-6">
<div className="bg-white rounded-4 p-3 shadow-sm">
<h4 className="fw-bold text-info mb-0">25+</h4>
<small className="text-muted">Lugares turísticos</small>
</div>
</div>
<div className="col-6">
<div className="bg-white rounded-4 p-3 shadow-sm">
<h4 className="fw-bold text-success mb-0">12</h4>
<small className="text-muted">Actividades disponibles</small>
</div>
</div>
</div>
<Link to={`/places/${slug}`} className="btn btn-info text-white rounded-pill px-5 py-3 fw-bold" > Comenzar a explorar </Link>
</div>
</div>
</div>
</section>
<section className="py-5 bg-light">
<div className="container">
<div className="card border-0 shadow rounded-5 text-center p-5">
<h2 className="fw-bold">¿Listo para vivir la aventura?</h2>
<p className="text-muted"> Únete y entra a una guía interactiva hecha para turistas. </p>
<div className="mx-auto">
<GoogleLoginButton townSlug={slug} />
</div>
</div>
</div>
</section>
<footer className="py-4 bg-white border-top text-center text-muted small"> © 2026 Turismo Local POC. Costa Rica. </footer>
</div> ); }