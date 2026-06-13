import { useEffect, useState } from "react"; import { useParams } from "react-router-dom"; import Navbar from "../components/Navbar"; import QRCodeCard from "../components/QRCodeCard"; import LoadingSpinner from "../components/LoadingSpinner"; import { getQrByTownSlug } from "../api/qrApi"; export default function QrPage() { const { townSlug } = useParams(); const [qrData, setQrData] = useState(null); const [loading, setLoading] = useState(true); const slug = townSlug || "playas-del-coco"; useEffect(() => { const loadQr = async () => { try { setLoading(true); const data = await getQrByTownSlug(slug); setQrData(data); } finally { setLoading(false); } }; loadQr(); }, [slug]); if (loading) { return ( <>
<Navbar townSlug={slug} />
<LoadingSpinner />
</> ); } const townName = qrData?.townName || "Playas del Coco"; const qrUrl = qrData?.qrUrl || `${window.location.origin}/p/${slug}`; return ( <>
<Navbar townSlug={slug} />
<main className="container py-4 py-lg-5">
<section className="text-center mb-4">
<span className="badge rounded-pill bg-info-subtle text-info px-4 py-2 mb-3"> Código QR por pueblo </span>
<h1 className="fw-bold mb-3"> QR turístico de <span className="text-info">{townName}</span>
</h1>
<p className="text-muted mx-auto mb-0" style={{ maxWidth: "720px" }}> Este código QR abre directamente la página turística del pueblo seleccionado. Cada pueblo tiene su propio QR y su propio catálogo de lugares. </p>
</section>
<div className="row justify-content-center align-items-start g-4">
<div className="col-12 col-lg-6 col-xl-5">
<QRCodeCard townName={townName} qrUrl={qrUrl} />
</div>
<div className="col-12 col-lg-5 col-xl-4">
<div className="card border-0 shadow-sm rounded-4">
<div className="card-body p-4">
<div className="d-flex gap-3 mb-4">
<span className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "42px", height: "42px" }} >
</span>
<div>
<h5 className="fw-bold mb-1">Listo para imprimir</h5>
<p className="text-muted mb-0"> Puedes descargar el QR como imagen PNG o imprimirlo directamente. </p>
</div>
</div>
<div className="d-flex gap-3 mb-4">
<span className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "42px", height: "42px" }} > i </span>
<div>
<h5 className="fw-bold mb-1">Flujo completo</h5>
<p className="text-muted mb-0"> QR a Login Google a JWT a Lugares turísticos del pueblo. </p>
</div>
</div>
<div className="bg-light rounded-4 p-3">
<p className="text-muted small mb-1">URL codificada:</p>
<p className="fw-semibold text-break mb-0">{qrUrl}</p>
</div>
</div>
</div>
</div>
</div>
</main>
<footer className="text-center py-4 text-muted small"> © 2026 Turismo Local POC. Costa Rica. </footer>
</> ); }