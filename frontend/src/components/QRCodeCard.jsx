import { useRef } from "react"; import { QRCodeCanvas } from "qrcode.react"; export default function QRCodeCard({ townName, qrUrl }) { const qrRef = useRef(null); const handlePrint = () => { window.print(); }; const handleOpenQr = () => { window.open(qrUrl, "_blank"); }; const handleCopy = async () => { await navigator.clipboard.writeText(qrUrl); alert("URL copiada"); }; const handleDownload = () => { const canvas = qrRef.current?.querySelector("canvas"); if (!canvas) { alert("No se pudo descargar el QR"); return; } const pngUrl = canvas .toDataURL("image/png") .replace("image/png", "image/octet-stream"); const downloadLink = document.createElement("a"); downloadLink.href = pngUrl; downloadLink.download = `qr-${townName .toLowerCase() .normalize("NFD") .replace(/[\u0300-\u036f]/g, "") .replaceAll(" ", "-")}.png`; document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink); }; return ( <div className="card border-0 shadow-lg rounded-4">
<div className="card-body p-4 text-center">
<div className="mb-3">
<span className="rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "50px", height: "50px", fontSize: "24px" }} >
</span>
<h5 className="fw-bold text-info mb-0">Turismo Local POC</h5>
</div>
<p className="text-muted mb-1">Bienvenido a</p>
<h3 className="fw-bold mb-4">{townName}</h3>
<div ref={qrRef} className="bg-white border rounded-4 d-inline-block p-3 mb-4" >
<QRCodeCanvas value={qrUrl} size={220} includeMargin={true} level="H" />
</div>
<p className="text-muted mb-3"> Escanea este código QR para descubrir los mejores lugares turísticos del pueblo. </p>
<div className="bg-light rounded-4 p-3 mb-4">
<p className="small text-muted mb-1">URL:</p>
<p className="small fw-semibold text-break mb-0">{qrUrl}</p>
</div>
<div className="d-grid gap-2 d-sm-flex flex-sm-wrap justify-content-sm-center">
<button className="btn btn-info text-white" onClick={handleOpenQr}> Probar QR </button>
<button className="btn btn-outline-info" onClick={handleDownload}> Descargar PNG </button>
<button className="btn btn-outline-secondary" onClick={handlePrint}> Imprimir </button>
<button className="btn btn-outline-dark" onClick={handleCopy}> Copiar URL </button>
</div>
</div>
</div> ); }