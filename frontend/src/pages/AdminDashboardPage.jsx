import { useEffect, useMemo, useState } from "react"; import { Link } from "react-router-dom"; import AdminLayout from "../components/AdminLayout"; import AdminStatCard from "../components/AdminStatCard"; import AdminTable from "../components/AdminTable"; import LoadingSpinner from "../components/LoadingSpinner"; import { getAdminPlaces, getAdminTowns } from "../api/adminApi"; const categoryLabels = { PLAYA: "Playa", MIRADOR: "Mirador", GASTRONOMIA: "Gastronomía", PASEOS: "Paseos", CULTURA: "Cultura", RESTAURANTE: "Restaurante", OTRO: "Otro" }; export default function AdminDashboardPage() { const [towns, setTowns] = useState([]); const [places, setPlaces] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { loadDashboardData(); }, []); const loadDashboardData = async () => { try { setLoading(true); const [townsData, placesData] = await Promise.all([ getAdminTowns(), getAdminPlaces() ]); setTowns(Array.isArray(townsData) ? townsData : []); setPlaces(Array.isArray(placesData) ? placesData : []); } finally { setLoading(false); } }; const activeTowns = useMemo(() => { return towns.filter((town) => town.active !== false); }, [towns]); const activePlaces = useMemo(() => { return places.filter((place) => place.active !== false); }, [places]); const categoryStats = useMemo(() => { const base = { PLAYA: 0, RESTAURANTE: 0, MIRADOR: 0, GASTRONOMIA: 0, PASEOS: 0, CULTURA: 0, OTRO: 0 }; activePlaces.forEach((place) => { const category = place.category || "OTRO"; base[category] = (base[category] || 0) + 1; }); return Object.entries(base) .map(([category, count]) => ({ category, label: categoryLabels[category] || category, count })) .filter((item) => item.count > 0); }, [activePlaces]); const latestPlaces = useMemo(() => { return [...places] .sort((a, b) => Number(b.id || 0) - Number(a.id || 0)) .slice(0, 5) .map((place) => ({ id: place.id, name: place.name || "Sin nombre", town: place.townName || "Sin pueblo", category: categoryLabels[place.category] || place.category || "Sin categoría", date: place.createdAt ? place.createdAt.slice(0, 10) : "Reciente", status: place.active === false ? "Inactivo" : "Activo" })); }, [places]); const maxCategoryValue = useMemo(() => { if (categoryStats.length === 0) return 1; return Math.max(...categoryStats.map((item) => item.count)); }, [categoryStats]); const columns = [ { key: "name", label: "Lugar" }, { key: "town", label: "Pueblo" }, { key: "category", label: "Categoría", render: (row) =>
<span className="admin-badge">{row.category}</span> }, { key: "date", label: "Fecha" }, { key: "status", label: "Estado", render: (row) => ( <span className={row.status === "Activo" ? "status-active" : "status-inactive"}> {row.status} </span> ) } ]; const downloadReport = () => { const content = [ "Reporte mensual Turismo Local POC", "", `Pueblos registrados: ${towns.length}`, `Pueblos activos: ${activeTowns.length}`, `Lugares registrados: ${places.length}`, `Lugares activos: ${activePlaces.length}`, "Usuarios registrados: indicador visual", "QR generados: indicador visual", "", "Lugares por categoría:", ...categoryStats.map((item) => `${item.label}: ${item.count}`) ].join("\n"); const blob = new Blob([content], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "reporte-mensual-turismo-local.txt"; link.click(); URL.revokeObjectURL(url); }; if (loading) { return ( <AdminLayout>
<LoadingSpinner />
</AdminLayout> ); } return ( <AdminLayout>
<div className="admin-page-header">
<div>
<h1>Panel de Administración</h1>
<p>Bienvenido de nuevo, gestiona los destinos turísticos registrados.</p>
</div>
<div className="admin-header-actions">
<button className="btn-admin-secondary" onClick={downloadReport}> Reporte </button>
<Link to="/admin/places" className="btn-admin-primary"> + Nuevo Lugar </Link>
</div>
</div>
<div className="admin-stats-grid">
<AdminStatCard icon="" label="Total de Pueblos" value={towns.length} trend={`${activeTowns.length} activos`} />
<AdminStatCard icon="" label="Lugares Turísticos" value={places.length} trend={`${activePlaces.length} activos`} />
<AdminStatCard icon="" label="Usuarios Registrados" value="Visual" trend="Módulo bonus" />
<AdminStatCard icon="" label="QRs Generados" value={towns.length} trend="Uno por pueblo" />
</div>
<div className="admin-dashboard-grid">
<section className="admin-panel">
<div className="admin-panel-header">
<div>
<h2>Lugares por Categoría</h2>
<p>Distribución real según los lugares guardados en la base de datos.</p>
</div>
<Link to="/admin/places" className="btn-admin-light"> Filtrar </Link>
</div> {categoryStats.length > 0 ? ( <div className="fake-chart"> {categoryStats.map((item) => ( <div key={item.category} className="chart-bar" style={{ height: `${Math.max((item.count / maxCategoryValue) * 80, 18)}%` }} >
<span>{item.count}</span>
<small>{item.label}</small>
</div> ))} </div> ) : ( <div className="text-center py-5">
<h3 className="fw-bold">Sin datos todavía</h3>
<p className="text-muted"> Agrega lugares turísticos para ver el gráfico por categoría. </p>
</div> )} </section>
<section className="admin-panel quick-actions">
<h2>Acciones Rápidas</h2>
<p>Tareas administrativas comunes.</p>
<Link to="/admin/places" className="quick-action primary"> + Agregar Nuevo Lugar </Link>
<Link to="/admin/towns" className="quick-action"> Gestionar Pueblos </Link>
<Link to="/qr/playas-del-coco" className="quick-action"> Generar Código QR </Link>
<button className="quick-action" onClick={downloadReport}> Exportar Reporte Mensual </button>
</section>
</div>
<section className="admin-panel mt-4">
<div className="admin-panel-header">
<div>
<h2>Últimos Lugares Agregados</h2>
<p>Monitoreo real de los lugares guardados en el backend.</p>
</div>
<Link to="/admin/places" className="admin-link"> Ver todos los lugares </Link>
</div> {latestPlaces.length > 0 ? ( <AdminTable columns={columns} data={latestPlaces} /> ) : ( <div className="text-center py-5">
<h3 className="fw-bold">No hay lugares registrados</h3>
<p className="text-muted"> Agrega lugares desde el módulo de gestión de lugares. </p>
<Link to="/admin/places" className="btn-admin-primary"> + Agregar lugar </Link>
</div> )} </section>
</AdminLayout> ); }