export default function PlaceCard({ place, onViewDetails }) { const name = place.name || "Lugar turístico"; const description = place.description || "Descubre este increíble destino local."; const category = place.category || "Turismo"; const imageUrl = place.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"; const address = place.address || "Ubicación no disponible"; const getCategoryColor = () => { const value = category.toLowerCase(); if (value.includes("playa")) return "bg-info"; if (value.includes("restaurante")) return "bg-warning text-dark"; if (value.includes("mirador")) return "bg-success"; if (value.includes("actividad")) return "bg-primary"; if (value.includes("hotel")) return "bg-dark"; return "bg-secondary"; }; return ( <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden place-card">
<div className="position-relative">
<img src={imageUrl} alt={name} className="card-img-top" style={{ height: 210, objectFit: "cover" }} />
<span className={`badge ${getCategoryColor()} position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2`}> {category} </span>
<span className="badge bg-warning text-dark position-absolute bottom-0 end-0 m-3 rounded-pill px-3"> 4.8 </span>
</div>
<div className="card-body p-4">
<h5 className="fw-bold mb-2">{name}</h5>
<p className="small text-muted mb-2"> {address} </p>
<p className="text-muted small mb-4"> {description} </p>
<button type="button" className="btn btn-light border w-100 text-info fw-semibold rounded-3" onClick={() => onViewDetails(place)} > Ver más detalles </button>
</div>
</div> ); }