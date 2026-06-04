import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ townName, qrUrl }) {
  const qrRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenQr = () => {
    window.open(qrUrl, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrUrl);
    alert("URL copiada");
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) {
      alert("No se pudo descargar el QR");
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-${townName.toLowerCase().replaceAll(" ", "-")}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="qr-print-wrapper">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center qr-card mx-auto"
        style={{ maxWidth: 390 }}
      >
        <div className="qr-poster-header">
          <div className="qr-logo-circle">☼</div>
          <p className="text-muted small mb-1">Turismo Local POC</p>
        </div>

        <h2 className="fw-bold mb-1">Bienvenido a</h2>

        <h3 className="text-info fw-bold text-uppercase mb-3">
          {townName}
        </h3>

        <p className="text-muted small mb-4">
          Escanea este código QR para descubrir los mejores lugares turísticos del pueblo.
        </p>

        <div className="qr-canvas-box bg-white border rounded-4 p-4 mx-auto mb-4" ref={qrRef}>
          <QRCodeCanvas
            value={qrUrl}
            size={240}
            bgColor="#ffffff"
            fgColor="#1f2937"
            level="H"
            includeMargin
          />
        </div>

        <div className="bg-light rounded-pill px-3 py-2 small text-muted mb-4 text-truncate">
          {qrUrl}
        </div>

        <div className="d-grid gap-3 qr-actions">
          <button
            type="button"
            className="btn btn-info text-white fw-bold rounded-3 py-3"
            onClick={handleOpenQr}
          >
            Probar QR
          </button>

          <button
            type="button"
            className="btn btn-warning text-white fw-bold rounded-3 py-3"
            onClick={handleDownload}
          >
            Descargar PNG
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary fw-bold rounded-3 py-3"
            onClick={handlePrint}
          >
            Imprimir Código
          </button>

          <button
            type="button"
            className="btn btn-light border fw-bold rounded-3 py-3"
            onClick={handleCopy}
          >
            Copiar URL
          </button>
        </div>

        <p className="small text-muted mt-4 mb-0 fst-italic qr-tip">
          Ideal para imprimir y colocar en hoteles, restaurantes o puntos turísticos.
        </p>
      </div>
    </div>
  );
}