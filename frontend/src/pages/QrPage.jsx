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
    <>
      <Navbar townSlug={slug} />

      <main className="container py-5">
        <section className="text-center mb-5">
          <span className="badge rounded-pill bg-info-subtle text-info px-4 py-2 mb-3">
            Generador de Acceso Rápido
          </span>

          <h1 className="fw-bold display-5 mb-3">
            Código QR de <span className="text-info">{townName}</span>
          </h1>

          <p className="text-muted mx-auto" style={{ maxWidth: "760px" }}>
            Este código QR abre directamente la página turística del pueblo.
            Al escanearlo, el usuario entra a la pantalla de bienvenida,
            inicia sesión con Google y luego accede a la lista de lugares turísticos.
          </p>
        </section>

        <div className="row justify-content-center g-4">
          <div className="col-lg-6">
            <QRCodeCard townName={townName} qrUrl={qrUrl} />
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    ✓
                  </span>

                  <div>
                    <h5 className="fw-bold mb-0">Listo para imprimir</h5>
                    <p className="text-muted mb-0">
                      Puedes descargar el QR como imagen PNG o imprimirlo directamente.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    ⓘ
                  </span>

                  <div>
                    <h5 className="fw-bold mb-0">Flujo completo</h5>
                    <p className="text-muted mb-0">
                      QR → Login Google → JWT → Lugares turísticos del pueblo.
                    </p>
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

      <footer className="text-center py-4 text-muted">
        © 2026 Turismo Local POC. Costa Rica.
      </footer>
    </>
  );
}