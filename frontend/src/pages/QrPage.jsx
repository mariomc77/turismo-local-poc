import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import QRCodeCard from "../components/QRCodeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getQrByTownSlug } from "../api/qrApi";

export default function QrPage() {
  const { townSlug } = useParams();

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  const slug = townSlug || "playas-del-coco";

  useEffect(() => {
    const loadQr = async () => {
      try {
        setLoading(true);
        const data = await getQrByTownSlug(slug);
        setQrData(data);
      } finally {
        setLoading(false);
      }
    };

    loadQr();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar townSlug={slug} />
        <LoadingSpinner />
      </>
    );
  }

  const townName = qrData?.townName || "Playas del Coco";
  const qrUrl = qrData?.qrUrl || `${window.location.origin}/p/${slug}`;

  return (
    <div className="min-vh-100 bg-white qr-page">
      <Navbar townSlug={slug} />

      <main className="container py-5">
        <div
          className="row align-items-center justify-content-center g-5"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <div className="col-lg-6">
            <span className="badge bg-info-subtle text-info rounded-pill px-4 py-2 mb-3">
              Generador de Acceso Rápido
            </span>

            <h1 className="display-4 fw-bold mb-4">
              Código QR de <span className="text-info">{townName}</span>
            </h1>

            <p className="lead text-muted mb-5">
              Este código QR abre directamente la página turística del pueblo. Al escanearlo, el usuario entra a la pantalla de bienvenida, inicia sesión con Google y luego accede a la lista de lugares turísticos.
            </p>

            <div className="row g-3 mb-4 qr-info-boxes">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <div className="fs-3 text-success mb-2">✓</div>
                  <h5 className="fw-bold">Listo para imprimir</h5>
                  <p className="text-muted small mb-0">
                    Puedes descargar el QR como imagen PNG o imprimirlo directamente.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <div className="fs-3 text-warning mb-2">ⓘ</div>
                  <h5 className="fw-bold">Flujo completo</h5>
                  <p className="text-muted small mb-0">
                    QR → Login Google → JWT → Lugares turísticos del pueblo.
                  </p>
                </div>
              </div>
            </div>

            <div className="alert alert-info rounded-4 border-0">
              <strong>URL codificada:</strong>
              <br />
              <span className="small">{qrUrl}</span>
            </div>
          </div>

          <div className="col-lg-5">
            <QRCodeCard townName={townName} qrUrl={qrUrl} />
          </div>
        </div>
      </main>

      <footer className="py-4 bg-white border-top text-center text-muted small">
        © 2026 Turismo Local POC. Costa Rica.
      </footer>
    </div>
  );
}