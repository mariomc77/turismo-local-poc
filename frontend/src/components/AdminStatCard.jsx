export default function AdminStatCard({ icon, label, value, trend }) { return ( <div className="admin-stat-card">
<div className="admin-stat-header">
<span className="admin-stat-icon">{icon}</span> {trend && <span className="admin-stat-trend">{trend}</span>} </div>
<p>{label}</p>
<h3>{value}</h3>
</div> ); }