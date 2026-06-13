import AdminLayout from "../components/AdminLayout"; export default function AdminReportsPage() { const reports = [ { id: 1, title: "Reporte mensual de lugares", description: "Resumen de lugares turísticos agregados durante el mes.", date: "Mayo 2026", icon: "" }, { id: 2, title: "Reporte de pueblos activos", description: "Listado de pueblos turísticos disponibles en la plataforma.", date: "Mayo 2026", icon: "" }, { id: 3, title: "Reporte de usuarios registrados", description: "Cantidad de usuarios registrados y actividad general.", date: "Mayo 2026", icon: "" }, { id: 4, title: "Reporte de códigos QR", description: "Resumen de códigos QR generados y escaneos simulados.", date: "Mayo 2026", icon: "" } ]; const exportReport = (reportTitle = "reporte-general") => { const content = `Turismo Local POC\n${reportTitle}\n\nReporte generado correctamente.\nPueblos: 24\nLugares: 142\nUsuarios: 1284\nQR generados: 3450`; const blob = new Blob([content], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${reportTitle.toLowerCase().replaceAll(" ", "-")}.txt`; link.click(); URL.revokeObjectURL(url); }; return ( <AdminLayout>
<div className="admin-page-header">
<div>
<h1>Reportes</h1>
<p>Visualiza y exporta reportes generales de la plataforma.</p>
</div>
<button className="btn-admin-primary" onClick={() => exportReport("reporte-general")}> Exportar reporte </button>
</div>
<div className="admin-stats-grid">
<div className="admin-stat-card"><div className="admin-stat-header"><span className="admin-stat-icon"></span><span className="admin-stat-trend">+12 este mes</span></div><p>Lugares registrados</p><h3>142</h3></div>
<div className="admin-stat-card"><div className="admin-stat-header"><span className="admin-stat-icon"></span><span className="admin-stat-trend">+2 este mes</span></div><p>Pueblos activos</p><h3>24</h3></div>
<div className="admin-stat-card"><div className="admin-stat-header"><span className="admin-stat-icon"></span><span className="admin-stat-trend">+15%</span></div><p>Usuarios registrados</p><h3>1,284</h3></div>
<div className="admin-stat-card"><div className="admin-stat-header"><span className="admin-stat-icon"></span><span className="admin-stat-trend">+842 escaneos</span></div><p>QR generados</p><h3>3,450</h3></div>
</div>
<section className="admin-panel mt-4">
<div className="admin-panel-header">
<div>
<h2>Reportes disponibles</h2>
<p>Selecciona un reporte para consultar o exportar.</p>
</div>
</div>
<div className="row g-4"> {reports.map((report) => ( <div className="col-md-6" key={report.id}>
<div className="card border-0 shadow-sm rounded-4 p-4 h-100">
<div className="fs-2 text-info mb-3">{report.icon}</div>
<h5 className="fw-bold">{report.title}</h5>
<p className="text-muted small">{report.description}</p>
<div className="d-flex justify-content-between align-items-center mt-3">
<span className="badge bg-light text-muted border">{report.date}</span>
<button className="btn btn-info text-white rounded-pill px-4" onClick={() => exportReport(report.title)}> Ver reporte </button>
</div>
</div>
</div> ))} </div>
</section>
</AdminLayout> ); }